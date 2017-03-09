'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScrollService, INVIEW_POSITION } from './scroll.service';
import { WarningsService } from './warnings.service';
import { Hash } from './hash.service';
import { SpecManager } from '../utils/spec-manager';
import { SchemaHelper } from './schema-helper.service';
import { AppStateService } from './app-state.service';
import { LazyTasksService } from '../shared/components/LazyFor/lazy-for';
import { JsonPointer, MarkdownHeading, StringMap } from '../utils/';
import * as slugify from 'slugify';


const CHANGE = {
  NEXT : 1,
  BACK : -1,
};

interface TagGroup {
  name: string;
  tags: string[];
}

export interface MenuItem {
  id: string;

  name: string;
  description?: string;

  items?: Array<MenuItem>;
  parent?: MenuItem;

  active?: boolean;
  ready?: boolean;

  depth?: number;
  flatIdx?: number;

  metadata?: any;
  isGroup?: boolean;
}

@Injectable()
export class MenuService {
  changed: EventEmitter<any> = new EventEmitter();
  changedActiveItem: EventEmitter<any> = new EventEmitter();

  items: MenuItem[];
  activeIdx: number = -1;

  private _flatItems: MenuItem[];
  private _hashSubscription: Subscription;
  private _scrollSubscription: Subscription;
  private _progressSubscription: Subscription;
  private _tagsWithMethods: any;

  constructor(
    private hash:Hash,
    private tasks: LazyTasksService,
    private scrollService: ScrollService,
    private appState: AppStateService,
    private specMgr:SpecManager
  ) {
    this.hash = hash;
    this.buildMenu();

    this._scrollSubscription = scrollService.scroll.subscribe((evt) => {
      this.onScroll(evt.isScrolledDown);
    });

    this._hashSubscription =  this.hash.value.subscribe((hash) => {
      this.onHashChange(hash);
    });

    this._progressSubscription = this.tasks.loadProgress.subscribe(progress => {
      if (progress === 100) {
        this.makeSureLastItemsEnabled();
      }
    });
  }

  get flatItems():MenuItem[] {
    if (!this._flatItems) {
      this._flatItems = this.flatMenu();
    }
    return this._flatItems;
  }

  enableItem(idx) {
    let item = this.flatItems[idx];
    item.ready = true;
    if (item.parent) {
      item.parent.ready = true;
      idx = item.parent.flatIdx;
    }

    // check if previous items§ can be enabled
    let prevItem = this.flatItems[idx -= 1];
    while(prevItem && (!prevItem.metadata || !prevItem.items)) {
      prevItem.ready = true;
      prevItem = this.flatItems[idx -= 1];
    }

    this.changed.next();
  }

  makeSureLastItemsEnabled() {
    let lastIdx = this.flatItems.length - 1;
    let item = this.flatItems[lastIdx];
    while(item && (!item.metadata || !item.items)) {
      item.ready = true;
      item = this.flatItems[lastIdx -= 1];
    }
  }

  onScroll(isScrolledDown) {
    let stable = false;
    while(!stable) {
      if(isScrolledDown) {
        let $nextEl = this.getEl(this.activeIdx + 1);
        if (!$nextEl) return;
        let nextInViewPos = this.scrollService.getElementPos($nextEl, true);
        if (nextInViewPos === INVIEW_POSITION.ABOVE) {
          stable = this.changeActive(CHANGE.NEXT);
          continue;
        }
      }
      let $currentEl = this.getCurrentEl();
      if (!$currentEl) return;
      var elementInViewPos = this.scrollService.getElementPos($currentEl);
      if(!isScrolledDown && elementInViewPos === INVIEW_POSITION.ABOVE ) {
        stable = this.changeActive(CHANGE.BACK);
        continue;
      }
      stable = true;
    }
  }

  onHashChange(hash?: string) {
    if (hash == undefined) return;
    let activated = this.activateByHash(hash);
    if (!this.tasks.processed) {
      this.tasks.start(this.activeIdx, this);
      this.scrollService.setStickElement(this.getCurrentEl());
      if (activated) this.scrollToActive();
      this.appState.stopLoading();
    } else {
      if (activated) this.scrollToActive();
    }
  }

  getEl(flatIdx:number):Element {
    if (flatIdx < 0) return null;
    if (flatIdx > this.flatItems.length - 1) return null;
    let currentItem = this.flatItems[flatIdx];
    if (!currentItem) return;
    if (currentItem.isGroup) currentItem = this.flatItems[flatIdx + 1];

    let selector = '';
    while(currentItem) {
      if (currentItem.id) {
        selector = `[section="${currentItem.id}"] ` + selector;
        // We only need to go up the chain for methods that
        // might have multiple tags. For headers/subheaders
        // we need to siply early terminate.
        if (!currentItem.metadata) {
          break;
        }
      }
      currentItem = currentItem.parent;
    }
    selector = selector.trim();
    return selector ? document.querySelector(selector) : null;
  }

  isTagOrGroupItem(flatIdx: number):boolean {
    let item = this.flatItems[flatIdx];
    return item && (item.isGroup || (item.metadata && item.metadata.type === 'tag'));
  }

  getTagInfoEl(flatIdx: number):Element {
    if (!this.isTagOrGroupItem(flatIdx)) return null;

    let el = this.getEl(flatIdx);
    return el && el.querySelector('.tag-info');
  }

  getCurrentEl():Element {
    return this.getEl(this.activeIdx);
  }

  deactivate(idx) {
    if (idx < 0) return;

    let item = this.flatItems[idx];
    item.active = false;
    while (item.parent) {
      item.parent.active = false;
      item = item.parent;
    }
  }

  activate(idx, force = false) {
    let item = this.flatItems[idx];
    if (!force && item && !item.ready) return;

    this.deactivate(this.activeIdx);
    this.activeIdx = idx;
    if (idx < 0) {
      this.hash.update('');
      return;
    }

    item.active = true;

    let cItem = item;
    while (cItem.parent) {
      cItem.parent.active = true;
      cItem = cItem.parent;
    }
    this.hash.update(this.hashFor(item.id, item.metadata, item.parent && item.parent.id));
    this.changedActiveItem.next(item);
  }

  changeActive(offset = 1):boolean {
    let noChange = (this.activeIdx <= 0 && offset === -1) ||
      (this.activeIdx === this.flatItems.length - 1 && offset === 1);
    this.activate(this.activeIdx + offset);
    return noChange;
  }

  scrollToActive() {
    let $el = this.getCurrentEl();
    if ($el) this.scrollService.scrollTo($el);
  }

  activateByHash(hash):boolean {
    if (!hash) return;
    let idx = 0;
    hash = hash.substr(1);
    let namespace = hash.split('/')[0];
    let ptr = decodeURIComponent(hash.substr(namespace.length + 1));
    if (namespace === 'section' || namespace === 'tag') {
      let sectionId = ptr.split('/')[0];
      ptr = ptr.substr(sectionId.length) || null;

      let searchId;
      if (namespace === 'section') {
        searchId = hash;
      } else {
        searchId = ptr || (namespace + '/' + sectionId);;
      }

      idx = this.flatItems.findIndex(item => item.id === searchId);
      if (idx < 0) this.tryScrollToId(searchId);
    } else if (namespace === 'operation') {
      idx = this.flatItems.findIndex(item => {
        return item.metadata && item.metadata.operationId === ptr;
      });
    }
    this.activate(idx, true);
    return idx >= 0;
  }

  tryScrollToId(id) {
    let $el = document.querySelector(`[section="${id}"]`);
    if ($el) this.scrollService.scrollTo($el);
  }

  addMarkdownItems() {
    let schema = this.specMgr.schema;
    let headings:StringMap<MarkdownHeading> = schema.info && schema.info['x-redoc-markdown-headers'] || {};
    Object.keys(headings).forEach(h => {
      let heading = headings[h];
      let id = 'section/' + heading.id;
      let item = {
        name: heading.title,
        id: id,
        items: null
      };
      item.items = this.getMarkdownSubheaders(item, heading);

      this.items.push(item);
    });
  }

  getMarkdownSubheaders(parent: MenuItem, parentHeading: MarkdownHeading):MenuItem[] {
    let res = [];

    Object.keys(parentHeading.children || {}).forEach(h => {
      let heading = parentHeading.children[h];
      let id = 'section/' + heading.id;

      let subItem = {
        name: heading.title,
        id: id,
        parent: parent
      };
      res.push(subItem);
    });

    return res;
  }

  getMethodsItems(parent: MenuItem, tag:any):MenuItem[] {
    if (!tag.methods || !tag.methods.length) return null;

    let res = [];
    for (let method of tag.methods) {
      let subItem = {
        name: SchemaHelper.methodSummary(method),
        id: method._pointer,
        description: method.description,
        metadata: {
          type: 'method',
          pointer: method._pointer,
          operationId: method.operationId
        },
        parent: parent
      };
      res.push(subItem);
    }
    return res;
  }

  hashFor(
    id: string|null, itemMeta:
    {operationId: string, type: string, pointer: string},
    parentId: string
  ) {
    if (!id) return null;
    if (itemMeta && itemMeta.type === 'method') {
      if (itemMeta.operationId) {
        return 'operation/' + encodeURIComponent(itemMeta.operationId);
      } else {
        return parentId + encodeURIComponent(itemMeta.pointer);
      }
    } else {
      return id;
    }
  }

  getTagsItems(parent: MenuItem, tagGroup:TagGroup = null):MenuItem[] {
    let schema = this.specMgr.schema;

    let tags;
    if (!tagGroup) {
      // all tags
      tags = Object.keys(this._tagsWithMethods);
    } else {
      tags = tagGroup.tags;
    }

    tags = tags.map(k => {
      if (!this._tagsWithMethods[k]) {
        WarningsService.warn(`Non-existing tag "${k}" is added to the group "${tagGroup.name}"`);
        return null;
      }
      this._tagsWithMethods[k].used = true;
      return this._tagsWithMethods[k];
    });

    let res = [];
    for (let tag of tags || []) {
      if (!tag) continue;
      let id = 'tag/' + slugify(tag.name);
      let item: MenuItem;

      // don't put empty tag into menu, instead put their methods
      if (tag.name === '') {
        let items = this.getMethodsItems(null, tag);
        res.push(...items);
        continue;
      }

      item = {
        name: tag['x-displayName'] || tag.name,
        id: id,
        description: tag.description,
        metadata: { type: 'tag', externalDocs: tag.externalDocs },
        parent: parent,
        items: null
      };
      item.items = this.getMethodsItems(item, tag);

      res.push(item);
    }
    return res;
  }

  getTagGroupsItems(parent: MenuItem, groups: TagGroup[]):MenuItem[] {
    let res = [];
    for (let group of groups) {
      let item;
      item = {
        name: group.name,
        id: null,
        description: '',
        parent: parent,
        isGroup: true,
        items: null
      };
      item.items = this.getTagsItems(item, group);
      res.push(item);
    }
    this.checkAllTagsUsedInGroups();
    return res;
  }

  checkAllTagsUsedInGroups() {
    for (let tag of Object.keys(this._tagsWithMethods)) {
      if (!this._tagsWithMethods[tag].used) {
        WarningsService.warn(`Tag "${tag}" is not added to any group`);
      }
    }
  }

  buildMenu() {
    this._tagsWithMethods = SchemaHelper.getTagsWithMethods(this.specMgr.schema);

    this.items = this.items || [];
    this.addMarkdownItems();
    if (this.specMgr.schema['x-tagGroups']) {
      this.items.push(...this.getTagGroupsItems(null, this.specMgr.schema['x-tagGroups']));
    } else {
      this.items.push(...this.getTagsItems(null));
    }
  }

  flatMenu():MenuItem[] {
    let menu = this.items;
    let res = [];
    let curDepth = 1;

    let recursive = (items) => {
      for (let item of items) {
        res.push(item);
        item.depth = item.isGroup ? 0 : curDepth;
        item.flatIdx = res.length - 1;
        if (item.items) {
          if (!item.isGroup) curDepth++;
          recursive(item.items);
          if (!item.isGroup) curDepth--;
        }
      }
    };
    recursive(menu);
    return res;
  }

  getItemById(id: string):MenuItem {
    return this.flatItems.find(item => item.id === id || item.id === `section/${id}`);
  }

  destroy() {
    this._hashSubscription.unsubscribe();
    this._scrollSubscription.unsubscribe();
  }
}
