'use strict';

import {NgZone, ChangeDetectionStrategy, ElementRef, forwardRef} from 'angular2/core';
import Redoc from '../Redoc/redoc';
import {document} from 'angular2/src/facade/browser';
import {BrowserDomAdapter} from 'angular2/platform/browser';
import {global} from 'angular2/src/facade/lang';

import {RedocComponent, BaseComponent, SchemaManager} from '../base';
import {redocEvents} from '../../events';

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
  templateUrl: './lib/components/SideMenu/side-menu.html',
  styleUrls: ['./lib/components/SideMenu/side-menu.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Reflect.metadata('parameters', [[SchemaManager], [ElementRef],
  [BrowserDomAdapter], [NgZone], [forwardRef(() => Redoc)]])
export default class SideMenu extends BaseComponent {
  constructor(schemaMgr, elementRef, adapter, zone, redoc) {
    super(schemaMgr);
    this.zone = zone;
    this.adapter = adapter;
    this.redoc = redoc;

    this.scrollParent = this.redoc.scrollParent;
    this.mobileNav = adapter.querySelector(elementRef.nativeElement, '.mobile-nav');
    this.resourcesNav = adapter.querySelector(elementRef.nativeElement, '#resources-nav');

    // for some reason constructor is not run inside zone
    // as workaround running it manually
    this.zone.run(() => {
      this.bindEvents();
    });
    this.activeCatIdx = 0;
    this.activeMethodIdx = -1;
    this.prevOffsetY = null;

    redocEvents.bootstrapped.subscribe(() => this.hashScroll());

    this.activeCatCaption = '';
    this.activeItemCaption = '';
  }

  scrollY() {
    return (this.scrollParent.pageYOffset != null) ? this.scrollParent.pageYOffset : this.scrollParent.scrollTop;
  }

  hashScroll(evt) {
    let hash = this.adapter.getLocation().hash;
    if (!hash) return;

    let el;
    hash = hash.substr(1);
    let namespace = hash.split('/')[0];
    let ptr = hash.substr(namespace.length + 1);
    if (namespace === 'operation') {
      el = this.getMethodElByOperId(ptr);
    } else if (namespace === 'tag') {
      let tag = ptr.split('/')[0];
      ptr = ptr.substr(tag.length);
      el = this.getMethodElByPtr(ptr, tag);
    }

    if (el) this.scrollTo(el);
    if (evt) evt.preventDefault();
  }

  bindEvents() {
    this.prevOffsetY = this.scrollY();

    //decorate option.scrollYOffset to account mobile nav
    this.scrollYOffset = () => {
      let mobileNavOffset = this.mobileNav.clientHeight;
      return this.redoc.options.scrollYOffset() + mobileNavOffset;
    };
    this._cancel = {};
    this._cancel.scroll = this.adapter.onAndCancel(this.scrollParent, 'scroll', () => { this.scrollHandler(); });
    this._cancel.hash = this.adapter.onAndCancel(global, 'hashchange',  evt => this.hashScroll(evt));
  }

  destroy() {
    this._cancel.scroll();
    this._cancel.hash();
  }

  activateAndScroll(idx, methodIdx) {
    if (this.mobileMode()) {
      this.toggleMobileNav();
    }
    this.activate(idx, methodIdx);
    this.scrollToActive();
  }

  scrollTo(el) {
    // TODO: rewrite this to use offsetTop as more reliable solution
    let subjRect = el.getBoundingClientRect();
    let offset = this.scrollY() + subjRect.top - this.scrollYOffset() + 1;
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

    this.activeCatCaption = '';
    this.activeItemCaption = '';

    menu[this.activeCatIdx].active = false;
    if (menu[this.activeCatIdx].methods.length) {
      if (this.activeMethodIdx >= 0) {
        menu[this.activeCatIdx].methods[this.activeMethodIdx].active = false;
      }
   }

    this.activeCatIdx = catIdx;
    this.activeMethodIdx = methodIdx;
    menu[catIdx].active = true;
    this.activeCatCaption = menu[catIdx].name;
    this.activeMethodPtr = null;
    if (menu[catIdx].methods.length && (methodIdx > -1)) {
      let currentItem = menu[catIdx].methods[methodIdx];
      currentItem.active = true;
      this.activeMethodPtr = currentItem.pointer;
      this.activeItemCaption = currentItem.summary;
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

  getMethodElByPtr(ptr, tag) {
    let selector = ptr ? `[pointer="${ptr}"][tag="${tag}"]` : `[tag="${tag}"]`;
    return document.querySelector(selector);
  }

  getMethodElByOperId(operationId) {
    let selector =`[operation-id="${operationId}"]`;
    return document.querySelector(selector);
  }

  getCurrentMethodEl() {
    return this.getMethodElByPtr(this.activeMethodPtr, this.data.menu[this.activeCatIdx].name);
  }

  /* returns 1 if element if above the view, 0 if in view and -1 below the view */
  getElementInViewPos(el) {
    if (Math.floor(el.getBoundingClientRect().top) > this.scrollYOffset()) {
      return INVIEW_POSITION.ABOVE;
    }

    if (el.getBoundingClientRect().bottom <= this.scrollYOffset()) {
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

  mobileMode() {
    return this.mobileNav.clientHeight > 0;
  }

  toggleMobileNav() {
    let dom = this.adapter;
    let overflowParent = (this.scrollParent === global) ? dom.defaultDoc().body : this.scrollParent;
    if (dom.hasStyle(this.resourcesNav, 'height')) {
      dom.removeStyle(this.resourcesNav, 'height');
      dom.removeStyle(overflowParent, 'overflow-y');
    } else {
      let viewportHeight = this.scrollParent.innerHeight || this.scrollParent.clientHeight;
      let height = viewportHeight - this.mobileNav.getBoundingClientRect().bottom;
      dom.setStyle(overflowParent, 'overflow-y', 'hidden');
      dom.setStyle(this.resourcesNav, 'height', height + 'px');
    }
  }

  init() {
    this.changeActive(CHANGE.INITIAL);
  }
}
//SideMenu.parameters = SideMenu.parameters.concat([[ElementRef],
//  [BrowserDomAdapter], [NgZone], [forwardRef(() => Redoc)] ]);
