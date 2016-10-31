'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { ScrollService, INVIEW_POSITION } from './scroll.service';
import { Hash } from './hash.service';
import { SpecManager } from '../utils/spec-manager';
import { SchemaHelper, MenuCategory } from './schema-helper.service';

const CHANGE = {
  NEXT : 1,
  BACK : -1,
  INITIAL : 0
};

@Injectable()
export class MenuService {
  changed: EventEmitter<any> = new EventEmitter();
  categories: Array<MenuCategory>;

  activeCatIdx: number = 0;
  activeMethodIdx: number = -1;
  activeMethodPtr: string;

  constructor(private hash:Hash, private scrollService:ScrollService, specMgr:SpecManager) {
    this.hash = hash;
    this.categories = SchemaHelper.buildMenuTree(specMgr.schema);

    scrollService.scroll.subscribe((evt) => {
      this.scrollUpdate(evt.isScrolledDown);
    });

    this.changeActive(CHANGE.INITIAL);

    this.hash.value.subscribe((hash) => {
      this.hashScroll(hash);
    });
  }

  scrollUpdate(isScrolledDown) {
    let stable = false;
    while(!stable) {
      let $activeMethodHost = this.getCurrentMethodEl();
      if (!$activeMethodHost) return;
      var elementInViewPos = this.scrollService.getElementPos($activeMethodHost);
      if(isScrolledDown) {
        //&& elementInViewPos === INVIEW_POSITION.BELLOW
        let $nextEl = this.getRelativeCatOrItem(1);
        let nextInViewPos = this.scrollService.getElementPos($nextEl, true);
        if (elementInViewPos === INVIEW_POSITION.BELLOW && nextInViewPos === INVIEW_POSITION.ABOVE) {
          stable = this.changeActive(CHANGE.NEXT);
          continue;
        }
      }
      if(!isScrolledDown && elementInViewPos === INVIEW_POSITION.ABOVE ) {
        stable = this.changeActive(CHANGE.BACK);
        continue;
      }
      stable = true;
    }
  }

  getRelativeCatOrItem(offset: number = 0) {
    let ptr, cat;
    cat = this.categories[this.activeCatIdx];
    if (cat.methods.length === 0) {
      ptr = null;
      cat = this.categories[this.activeCatIdx + Math.sign(offset)] || cat;
    } else {
      let cat = this.categories[this.activeCatIdx];
      let idx = this.activeMethodIdx + offset;
      if ((idx >= cat.methods.length - 1) || idx < 0) {
        cat = this.categories[this.activeCatIdx + Math.sign(offset)] || cat;
        idx = offset > 0 ? -1 : cat.methods.length - 1;
      }
      ptr = cat.methods[idx] && cat.methods[idx].pointer;
    }

    return this.getMethodElByPtr(ptr, cat.id);
  }

  getCurrentMethodEl() {
    return this.getMethodElByPtr(this.activeMethodPtr,
      this.categories[this.activeCatIdx].id);
  }

  getMethodElByPtr(ptr, section) {
    let selector = ptr ? `[pointer="${ptr}"][section="${section}"]` : `[section="${section}"]`;
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
    if (!catCount) return [0, -1];
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
      let sectionId = ptr.split('/')[0];
      ptr = ptr.substr(sectionId.length) || null;
      sectionId = namespace + (sectionId ? '/' + sectionId : '');
      $el = this.getMethodElByPtr(ptr, sectionId);
    } else {
      $el = this.getMethodElByPtr(null, namespace + '/' + ptr);
    }

    if ($el) this.scrollService.scrollTo($el);
  }
}
