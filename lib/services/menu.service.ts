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
  INITIAL : 0
};

@Injectable()
export class MenuService {

  changed: EventEmitter<any> = new EventEmitter();
  ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
  items: Array<MenuItem>;
  flatItems: Array<MenuItem>;

  activeCatIdx: number = 0;
  activeMethodIdx: number = -1;

  activeIdx: number = -1;

  private _hashSubscription: Subscription;

  constructor(
    private hash:Hash,
    private tasks: LazyTasksService,
    private scrollService: ScrollService,
    private appState: AppStateService,
    specMgr:SpecManager
  ) {
    this.hash = hash;
    this.items = SchemaHelper.buildMenuTree(specMgr.schema);
    this.flatItems = SchemaHelper.flatMenu(this.items);

    scrollService.scroll.subscribe((evt) => {
      this.scrollUpdate(evt.isScrolledDown);
    });

    this._hashSubscription =  this.hash.value.subscribe((hash) => {
      if (hash == undefined) return;
      this.setActiveByHash(hash);
      if (!this.tasks.empty) {
        this.tasks.start(this.activeIdx, this);
        this.scrollService.setStickElement(this.getCurrentEl());
        if (hash) this.scrollToActive();
        this.appState.stopLoading();
      } else {
        if (hash) this.scrollToActive();
      }
    });
  }

  enableItem(idx) {
    let item = this.flatItems[idx];
    item.ready = true;
    if (item.parent) {
      item.parent.ready = true;
      idx = item.parent.flatIdx;
    }

    let prevItem = this.flatItems[idx -= 1];
    while(prevItem && (!prevItem.metadata || !prevItem.items)) {
      prevItem.ready = true;
      prevItem = this.flatItems[idx -= 1];
    }

    this.changed.next();
  }

  scrollUpdate(isScrolledDown) {
    let stable = false;
    while(!stable) {
      if(isScrolledDown) {
        //&& elementInViewPos === INVIEW_POSITION.BELLOW
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

  getEl(flatIdx) {
    if (flatIdx < 0) flatIdx = 0;
    let currentItem = this.flatItems[flatIdx];
    let selector = '';
    while(currentItem) {
      selector = `[section="${currentItem.id}"] ` + selector
      currentItem = currentItem.parent;
    }
    selector = selector.trim();
    return selector ? document.querySelector(selector) : null;
  }

  getCurrentEl() {
    return this.getEl(this.activeIdx);
  }

  deactivate(idx) {
    if (idx < 0) return;

    let prevItem = this.flatItems[idx];
    prevItem.active = false;
    if (prevItem.parent) {
      prevItem.parent.active = false;
    }
  }

  activate(idx) {
    this.deactivate(this.activeIdx);
    this.activeIdx = idx;
    if (idx < 0) return;

    let currentItem = this.flatItems[this.activeIdx];
    currentItem.active = true;
    if (currentItem.parent) {
      currentItem.parent.active = true;
    }

    this.changed.next(currentItem);
  }

  changeActive(offset = 1) {
    let noChange = (this.activeIdx <= 0 && offset === -1) ||
      (this.activeIdx === this.flatItems.length - 1 && offset === 1);
    this.activate(this.activeIdx + offset);
    return noChange;
  }

  scrollToActive() {
    this.scrollService.scrollTo(this.getCurrentEl());
  }

  setActiveByHash(hash) {
    if (!hash) return;
    let idx = 0;
    hash = hash.substr(1);
    let namespace = hash.split('/')[0];
    let ptr = decodeURIComponent(hash.substr(namespace.length + 1));
    if (namespace === 'section' || namespace === 'tag') {
      let sectionId = ptr.split('/')[0];
      ptr = ptr.substr(sectionId.length) || null;
      let searchId = ptr || (namespace + '/' + sectionId);
      idx = this.flatItems.findIndex(item => item.id === searchId);
    } else if (namespace === 'operation') {
      idx = this.flatItems.findIndex(item => {
        return item.metadata && item.metadata.operationId === ptr
      })
    }
    this.activate(idx);
  }

  destroy() {
    this._hashSubscription.unsubscribe();
  }
}
