'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ScrollService, INVIEW_POSITION } from './scroll.service';
import { Hash } from './hash.service';
import { SpecManager } from '../utils/spec-manager';
import { SchemaHelper, MenuCategory } from './schema-helper.service';
import { AppStateService } from './app-state.service';
import { LazyTasksService } from '../shared/components/LazyFor/lazy-for';

const CHANGE = {
  NEXT : 1,
  BACK : -1,
  INITIAL : 0
};

@Injectable()
export class MenuService {

  changed: EventEmitter<any> = new EventEmitter();
  ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
  categories: Array<MenuCategory>;

  activeCatIdx: number = 0;
  activeMethodIdx: number = -1;

  private _hashSubscription: Subscription;

  constructor(
    private hash:Hash,
    private tasks: LazyTasksService,
    private scrollService: ScrollService,
    private appState: AppStateService,
    specMgr:SpecManager
  ) {
    this.hash = hash;
    this.categories = SchemaHelper.buildMenuTree(specMgr.schema);

    scrollService.scroll.subscribe((evt) => {
      this.scrollUpdate(evt.isScrolledDown);
    });

    //this.changeActive(CHANGE.INITIAL);

    this._hashSubscription =  this.hash.value.subscribe((hash) => {
      if (hash == undefined) return;
      this.setActiveByHash(hash);
      if (!this.tasks.empty) {
        this.tasks.start(this.activeCatIdx, this.activeMethodIdx, this);
        this.scrollService.setStickElement(this.getCurrentMethodEl());
        if (hash) this.scrollToActive();
        this.appState.stopLoading();
      } else {
        if (hash) this.scrollToActive();
      }
    });
  }

  enableItem(catIdx, methodIdx, skipUpdate = false) {
    let cat = this.categories[catIdx];
    cat.ready = true;
    if (cat.methods.length) cat.methods[methodIdx].ready = true;
    let prevCat = this.categories[catIdx - 1];
    if (prevCat && !prevCat.ready && (prevCat.virtual || !prevCat.methods.length)) {
      this.enableItem(catIdx - 1, -1, true);
    }

    if (skipUpdate) return;
    this.changed.next();
  }

  get activeMethodPtr() {
    let cat = this.categories[this.activeCatIdx];
    let ptr = null;
    if (cat && cat.methods.length) {
      let mtd = cat.methods[this.activeMethodIdx];
      ptr = mtd && mtd.pointer || null;
    }
    return ptr;
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
        if (!$nextEl) return;
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
    if (catIdx < 0) return;

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
    let currentItem;
    if (menu[catIdx].methods.length && (methodIdx > -1)) {
      currentItem = menu[catIdx].methods[methodIdx];
      currentItem.active = true;
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

  setActiveByHash(hash) {
    if (!hash) {
      if (this.categories[0].headless) {
        this.activate(0, 0);
      }
      return;
    }
    let catIdx, methodIdx;
    hash = hash.substr(1);
    let namespace = hash.split('/')[0];
    let ptr = decodeURIComponent(hash.substr(namespace.length + 1));
    if (namespace === 'section' || namespace === 'tag') {
      let sectionId = ptr.split('/')[0];
      catIdx = this.categories.findIndex(cat => cat.id === namespace + '/' + sectionId);
      let cat = this.categories[catIdx];
      ptr = ptr.substr(sectionId.length) || null;
      methodIdx = cat.methods.findIndex(method => method.pointer === ptr);
    } else {
      catIdx = this.categories.findIndex(cat => {
        if (!cat.methods.length) return false;
        methodIdx = cat.methods.findIndex(method => method.operationId === ptr || method.pointer === ptr);
        if (methodIdx >= 0) {
          return true;
        } else {
          return false;
        }
      });
    }
    this.activate(catIdx, methodIdx);
  }

  destroy() {
    this._hashSubscription.unsubscribe();
  }
}
