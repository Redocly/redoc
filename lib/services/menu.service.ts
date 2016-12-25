'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScrollService, INVIEW_POSITION } from './scroll.service';
import { Hash } from './hash.service';
import { SpecManager } from '../utils/spec-manager';
import { SchemaHelper, MenuItem } from './schema-helper.service';
import { AppStateService } from './app-state.service';
import { LazyTasksService } from '../shared/components/LazyFor/lazy-for';
import { JsonPointer } from '../utils/JsonPointer';
import * as slugify from 'slugify';


const CHANGE = {
  NEXT : 1,
  BACK : -1,
};

@Injectable()
export class MenuService {
  changed: EventEmitter<any> = new EventEmitter();

  items: MenuItem[];
  activeIdx: number = -1;

  private _flatItems: MenuItem[];
  private _hashSubscription: Subscription;
  private _scrollSubscription: Subscription;

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

    // check if previous items can be enabled
    let prevItem = this.flatItems[idx -= 1];
    while(prevItem && (!prevItem.metadata || !prevItem.items)) {
      prevItem.ready = true;
      prevItem = this.flatItems[idx -= 1];
    }

    this.changed.next();
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
    if (!this.tasks.empty) {
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
    let currentItem = this.flatItems[flatIdx];
    let selector = '';
    while(currentItem) {
      selector = `[section="${currentItem.id}"] ` + selector
      currentItem = currentItem.parent;
    }
    selector = selector.trim();
    return selector ? document.querySelector(selector) : null;
  }

  getCurrentEl():Element {
    return this.getEl(this.activeIdx);
  }

  deactivate(idx) {
    if (idx < 0) return;

    let item = this.flatItems[idx];
    item.active = false;
    if (item.parent) {
      item.parent.active = false;
    }
  }

  activate(idx, force = false) {
    let item = this.flatItems[idx];
    if (!force && item && !item.ready) return;

    this.deactivate(this.activeIdx);
    this.activeIdx = idx;
    if (idx < 0) return;

    item.active = true;
    if (item.parent) {
      item.parent.active = true;
    }

    this.changed.next(item);
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
        return item.metadata && item.metadata.operationId === ptr
      })
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
    for (let header of (<Array<string>>(schema.info && schema.info['x-redoc-markdown-headers'] || []))) {
      let id = 'section/' + slugify(header);
      let item = {
        name: header,
        id: id
      }
      this.items.push(item);
    }
  }

  addTagsAndOperationItems() {
    let schema = this.specMgr.schema;
    let menu = this.items;

    let tags = SchemaHelper.getTagsWithMethods(schema);
    for (let tag of tags || []) {
      let id = 'tag/' + slugify(tag.name);
      let item: MenuItem;
      let items: MenuItem[];

      // don't put empty tag into menu, instead put their methods
      if (tag.name !== '') {
        item = {
          name: tag['x-displayName'] || tag.name,
          id: id,
          description: tag.description,
          metadata: { type: 'tag' }
        };
        if (tag.methods && tag.methods.length) {
          item.items = items = [];
        }
      } else {
        item = null;
        items = menu;
      }

      if (items) {
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
            parent: item
          }
          items.push(subItem);
        }
      }

      if (item) menu.push(item);
    }
  }

  buildMenu() {
    this.items = this.items || [];
    this.addMarkdownItems();
    this.addTagsAndOperationItems();
  }

  flatMenu():MenuItem[] {
    let menu = this.items;
    let res = [];
    let level = 1;

    let recursive = function(items) {
      for (let item of items) {
        res.push(item);
        item.level = item.level || level;
        item.flatIdx = res.length - 1;
        if (item.items) {
          level++;
          recursive(item.items);
          level--;
        }
      }
    }
    recursive(menu);
    return res;
  }

  destroy() {
    this._hashSubscription.unsubscribe();
    this._scrollSubscription.unsubscribe();
  }
}
