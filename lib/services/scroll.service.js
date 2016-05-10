'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { OptionsService } from './options.service.js';

export const INVIEW_POSITION = {
  ABOVE : 1,
  BELLOW: -1,
  INVIEW: 0
};

@Reflect.metadata('parameters', [
  [BrowserDomAdapter], [OptionsService]])
@Injectable()
export class ScrollService {
  constructor(dom, optionsService) {
    //events.bootstrapped.subscribe(() => this.hashScroll());
    this.scrollYOffset = () => optionsService.options.scrollYOffset();
    this.$scrollParent = optionsService.options.$scrollParent;
    this.scroll = new EventEmitter();
    this.dom = dom;
    this.bind();
  }

  scrollY() {
    return (this.$scrollParent.pageYOffset != null) ? this.$scrollParent.pageYOffset : this.$scrollParent.scrollTop;
  }

  /* returns 1 if element if above the view, 0 if in view and -1 below the view */
  getElementPos($el) {
    if (Math.floor($el.getBoundingClientRect().top) > this.scrollYOffset()) {
      return INVIEW_POSITION.ABOVE;
    }

    if ($el.getBoundingClientRect().bottom <= this.scrollYOffset()) {
      return INVIEW_POSITION.BELLOW;
    }
    return INVIEW_POSITION.INVIEW;
  }

  scrollTo($el) {
    // TODO: rewrite this to use offsetTop as more reliable solution
    let subjRect = $el.getBoundingClientRect();
    let offset = this.scrollY() + subjRect.top - this.scrollYOffset() + 1;
    if (this.$scrollParent.scrollTo) {
      this.$scrollParent.scrollTo(0, offset);
    } else {
      this.$scrollParent.scrollTop = offset;
    }
  }

  scrollHandler(evt) {
    let isScrolledDown = (this.scrollY() - this.prevOffsetY > 0);
    this.prevOffsetY = this.scrollY();
    this.scroll.next({isScrolledDown, evt});
  }

  bind() {
    this.prevOffsetY = this.scrollY();
    this._cancel = this.dom.onAndCancel(this.$scrollParent, 'scroll', (evt) => { this.scrollHandler(evt); });
  }

  unbind() {
    this._cancel();
  }
}
