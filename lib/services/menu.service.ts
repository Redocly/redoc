'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { ScrollService, INVIEW_POSITION } from './scroll.service';
import { Hash } from './hash.service';
import { SchemaManager } from '../utils/SchemaManager';

const CHANGE = {
  NEXT : 1,
  BACK : -1,
  INITIAL : 0
};

@Injectable()
export class MenuService {
  changed: EventEmitter<any> = new EventEmitter();
  categories: any;

  activeCatIdx: number = 0;
  activeMethodIdx: number = -1;
  activeMethodPtr: string;

  constructor(private hash:Hash, private scrollService:ScrollService, schemaMgr:SchemaManager) {
    this.hash = hash;

    this.categories = Array.from(schemaMgr.buildMenuTree().entries()).map(
      el => ({name: el[0], description: el[1].description, methods: el[1].methods})
    );

    scrollService.scroll.subscribe((evt) => {
      this.scrollUpdate(evt.isScrolledDown);
    });

    this.changeActive(CHANGE.INITIAL);

    this.hash.changed.subscribe((hash) => {
      this.hashScroll(hash);
    });
  }

  scrollUpdate(isScrolledDown) {
    let stable = false;
    while(!stable) {
      let $activeMethodHost = this.getCurrentMethodEl();
      if (!$activeMethodHost) return;
      var elementInViewPos = this.scrollService.getElementPos($activeMethodHost);
      if(isScrolledDown && elementInViewPos === INVIEW_POSITION.BELLOW) {
        stable = this.changeActive(CHANGE.NEXT);
        continue;
      }
      if(!isScrolledDown && elementInViewPos === INVIEW_POSITION.ABOVE ) {
        stable = this.changeActive(CHANGE.BACK);
        continue;
      }
      stable = true;
    }
  }

  getCurrentMethodEl() {
    return this.getMethodElByPtr(this.activeMethodPtr,
      this.categories[this.activeCatIdx].name);
  }

  getMethodElByPtr(ptr, tag) {
    let selector = ptr ? `[pointer="${ptr}"][tag="${tag}"]` : `[tag="${tag}"]`;
    return document.querySelector(selector);
  }

  getMethodElByOperId(operationId) {
    let selector =`[operation-id="${operationId}"]`;
    return document.querySelector(selector);
  }

  activate(catIdx, methodIdx) {
    let menu = this.categories;

    menu[this.activeCatIdx].active = false;
    if (menu[this.activeCatIdx].methods.length) {
      if (this.activeMethodIdx >= 0) {
        menu[this.activeCatIdx].methods[this.activeMethodIdx].active = false;
      }
   }

    this.activeCatIdx = catIdx;
    this.activeMethodIdx = methodIdx;
    menu[catIdx].active = true;
    this.activeMethodPtr = null;
    let currentItem;
    if (menu[catIdx].methods.length && (methodIdx > -1)) {
      currentItem = menu[catIdx].methods[methodIdx];
      currentItem.active = true;
      this.activeMethodPtr = currentItem.pointer;
    }

    this.changed.next({cat: menu[catIdx], item: currentItem});
  }

  _calcActiveIndexes(offset) {
    let menu = this.categories;
    let catCount = menu.length;
    let catLength = menu[this.activeCatIdx].methods.length;

    let resMethodIdx = this.activeMethodIdx + offset;
    let resCatIdx = this.activeCatIdx;

    if (resMethodIdx > catLength - 1) {
      resCatIdx++;
      resMethodIdx = -1;
    }
    if (resMethodIdx < -1) {
      let prevCatIdx = --resCatIdx;
      catLength = menu[Math.max(prevCatIdx, 0)].methods.length;
      resMethodIdx = catLength - 1;
    }
    if (resCatIdx > catCount - 1) {
      resCatIdx = catCount - 1;
      resMethodIdx = catLength - 1;
    }
    if (resCatIdx < 0) {
      resCatIdx = 0;
      resMethodIdx = 0;
    }

    return [resCatIdx, resMethodIdx];
  }

  changeActive(offset = 1) {
    let [catIdx, methodIdx] = this._calcActiveIndexes(offset);
    this.activate(catIdx, methodIdx);
    return (methodIdx === 0 && catIdx === 0);
  }

  scrollToActive() {
    this.scrollService.scrollTo(this.getCurrentMethodEl());
  }

  hashScroll(hash) {
    if (!hash) return;

    let $el;
    hash = hash.substr(1);
    let namespace = hash.split('/')[0];
    let ptr = decodeURIComponent(hash.substr(namespace.length + 1));
    if (namespace === 'operation') {
      $el = this.getMethodElByOperId(ptr);
    } else if (namespace === 'tag') {
      let tag = ptr.split('/')[0];
      ptr = ptr.substr(tag.length);
      $el = this.getMethodElByPtr(ptr, tag);
    }

    if ($el) this.scrollService.scrollTo($el);
  }
}
