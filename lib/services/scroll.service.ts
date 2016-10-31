'use strict';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { BrowserDomAdapter as DOM } from '../utils/browser-adapter';
import { OptionsService } from './options.service';
import { throttle } from '../utils/helpers';

export const INVIEW_POSITION = {
  ABOVE : 1,
  BELLOW: -1,
  INVIEW: 0
};

@Injectable()
export class ScrollService {
  scrollYOffset: any;
  $scrollParent: any;
  @Output() scroll = new EventEmitter();
  private prevOffsetY: number;
  private _cancel:any;
  constructor(optionsService:OptionsService) {
    this.scrollYOffset = () => optionsService.options.scrollYOffset();
    this.$scrollParent = optionsService.options.$scrollParent;
    this.scroll = new EventEmitter();
    this.bind();
  }

  scrollY() {
    return (this.$scrollParent.pageYOffset != undefined) ? this.$scrollParent.pageYOffset : this.$scrollParent.scrollTop;
  }

  /* returns 1 if element if above the view, 0 if in view and -1 below the view */
  getElementPos($el, inverted=false) {
    let scrollYOffset = this.scrollYOffset();
    let mul = inverted ? -1 : 1;
    if (mul*Math.floor($el.getBoundingClientRect().top) > mul*scrollYOffset) {
      return INVIEW_POSITION.ABOVE;
    }

    if (mul*$el.getBoundingClientRect().bottom <= mul*scrollYOffset) {
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
    this._cancel = DOM.onAndCancel(this.$scrollParent, 'scroll',
      throttle((evt) => { this.scrollHandler(evt); }, 100, this));
  }

  unbind() {
    this._cancel();
  }
}
