'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {NgZone, ChangeDetectionStrategy} from 'angular2/core';
import {redocEvents} from '../../events';
import detectScollParent from 'scrollparent';
import {document} from 'angular2/src/facade/browser';

import {BrowserDomAdapter} from 'angular2/platform/browser';
import {global} from 'angular2/src/facade/lang';

const CHANGE = {
  NEXT : 1,
  BACK : -1,
  INITIAL : 0
};

const INVIEW_POSITION = {
  ABOVE : 1,
  BELLOW: -1,
  INVIEW: 0
};

@RedocComponent({
  selector: 'side-menu',
  providers: [BrowserDomAdapter],
  templateUrl: './lib/components/SideMenu/side-menu.html',
  styleUrls: ['./lib/components/SideMenu/side-menu.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export default class SideMenu extends BaseComponent {
  constructor(schemaMgr, adapter, zone) {
    super(schemaMgr);
    this.zone = zone;
    this.adapter = adapter;

    this.scrollParent = detectScollParent(document.querySelector('methods-list'));

    // for some reason constructor is not run inside zone
    // as workaround running it manually
    this.zone.run(() => {
      this.bindEvents();
    });
    this.activeCatIdx = 0;
    this.activeMethodIdx = -1;
    this.prevOffsetY = null;

    redocEvents.bootstrapped.subscribe(() => this.hashScroll());
  }

  scrollY() {
    return (this.scrollParent.scrollY != null) ? this.scrollParent.scrollY : this.scrollParent.scrollTop;
  }

  hashScroll(evt) {
    let hash = this.adapter.getLocation().hash;
    if (!hash) return;

    hash = hash.substr(1);
    let tag = hash.split('/')[0];
    let ptr = hash.substr(tag.length);
    let el = this.getMethodEl(ptr, tag);
    if (el) this.scrollTo(el);
    if (evt) evt.preventDefault();
  }

  bindEvents() {
    this.prevOffsetY = this.scrollY();
    this.viewBoxTop = this.scrollParent.offsetTop || 0;
    this._cancel = {};
    this._cancel.scroll = this.adapter.onAndCancel(this.scrollParent, 'scroll', () => { this.scrollHandler(); });
    this._cancel.hash = this.adapter.onAndCancel(global, 'hashchange',  evt => this.hashScroll(evt));
  }

  destroy() {
    this._cancel.scroll();
    this._cancel.hash();
  }

  activateAndScroll(idx, methodIdx) {
    this.activate(idx, methodIdx);
    this.scrollToActive();
  }

  scrollTo(el) {
    // TODO: rewrite this to use offsetTop as more reliable solution
    let subjRect = el.getBoundingClientRect();
    let offset = this.scrollY() + subjRect.top - this.viewBoxTop + 1;
    if (this.scrollParent.scrollTo) {
      this.scrollParent.scrollTo(0, offset);
    } else {
      this.scrollParent.scrollTop = offset;
    }
  }

  scrollToActive() {
    this.scrollTo(this.getCurrentMethodEl());
  }

  activate(catIdx, methodIdx) {
    let menu = this.data.menu;
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
    if (menu[catIdx].methods.length && (methodIdx > -1)) {
      let currentItem = menu[catIdx].methods[methodIdx];
      currentItem.active = true;
      this.activeMethodPtr = currentItem.pointer;
    }
  }

  _calcActiveIndexes(offset) {
    let menu = this.data.menu;
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

  getMethodEl(ptr, tag) {
    let selector = ptr ? `[pointer="${ptr}"][tag="${tag}"]` : `[tag="${tag}"]`;
    return document.querySelector(selector);
  }

  getCurrentMethodEl() {
    return this.getMethodEl(this.activeMethodPtr, this.data.menu[this.activeCatIdx].name);
  }

  /* returns 1 if element if above the view, 0 if in view and -1 below the view */
  getElementInViewPos(el) {
    if (Math.floor(el.getBoundingClientRect().top) > this.viewBoxTop) {
      return INVIEW_POSITION.ABOVE;
    }

    if (el.getBoundingClientRect().bottom <= this.viewBoxTop) {
      return INVIEW_POSITION.BELLOW;
    }
    return INVIEW_POSITION.INVIEW;
  }

  scrollHandler() {
    let isScrolledDown = (this.scrollY() - this.prevOffsetY > 0);
    this.prevOffsetY = this.scrollY();
    let stable = false;
    while(!stable) {
      let activeMethodHost = this.getCurrentMethodEl();
      if (!activeMethodHost) return;
      var elementInViewPos = this.getElementInViewPos(activeMethodHost);
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

  prepareModel() {
    this.data = {};
    this.data.menu = Array.from(this.schemaMgr.buildMenuTree().entries()).map(
      el => ({name: el[0], description: el[1].description, methods: el[1].methods})
    );
  }

  init() {
    this.changeActive(CHANGE.INITIAL);
  }
}
SideMenu.parameters = SideMenu.parameters.concat([[BrowserDomAdapter], [NgZone]]);
