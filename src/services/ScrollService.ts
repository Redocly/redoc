import { bind } from 'decko';
import { EventEmitter } from 'eventemitter3';

import { IS_BROWSER, querySelector, Throttle } from '../utils';
import type { RedocNormalizedOptions } from './RedocNormalizedOptions';

const EVENT = 'scroll';

export class ScrollService {
  private _scrollParent: Window | HTMLElement | undefined;
  private _emiter: EventEmitter;
  private _prevOffsetY = 0;
  private _bound = false;
  constructor(private options: RedocNormalizedOptions) {
    this._scrollParent = IS_BROWSER ? window : undefined;
    this._emiter = new EventEmitter();
  }

  /**
   * Starts listening to scroll events. Called when the store is mounted, so a store
   * that is never mounted does not leave a listener behind.
   */
  bind() {
    if (this._bound) return;
    this._bound = true;
    this._prevOffsetY = this.scrollY();
    if (this._scrollParent) {
      this._scrollParent.addEventListener('scroll', this.handleScroll);
    }
  }

  dispose() {
    this._bound = false;
    if (this._scrollParent) {
      this._scrollParent.removeEventListener('scroll', this.handleScroll);
    }
    this._emiter.removeAllListeners(EVENT);
  }

  scrollY(): number {
    if (typeof HTMLElement !== 'undefined' && this._scrollParent instanceof HTMLElement) {
      return this._scrollParent.scrollTop;
    } else if (this._scrollParent !== undefined) {
      return (this._scrollParent as Window).pageYOffset;
    } else {
      return 0;
    }
  }

  isElementBellow(el: Element | null) {
    if (el === null) {
      return;
    }
    return el.getBoundingClientRect().top > this.options.scrollYOffset();
  }

  isElementAbove(el: Element | null) {
    if (el === null) {
      return;
    }
    const top = el.getBoundingClientRect().top;
    return (top > 0 ? Math.floor(top) : Math.ceil(top)) <= this.options.scrollYOffset();
  }

  subscribe(cb): () => void {
    const emmiter = this._emiter.addListener(EVENT, cb);
    return () => emmiter.removeListener(EVENT, cb);
  }

  scrollIntoView(element: Element | null) {
    if (element === null) {
      return;
    }
    element.scrollIntoView();
    if (this._scrollParent && this._scrollParent.scrollBy) {
      // adding 1 account rounding errors in case scrollYOffset is float-number
      (this._scrollParent.scrollBy as any)(0, -this.options.scrollYOffset() + 1);
    }
  }

  scrollIntoViewBySelector(selector: string) {
    const element = querySelector(selector);
    this.scrollIntoView(element);
  }

  @bind
  @Throttle(100)
  handleScroll() {
    const scrollY = this.scrollY();
    const isScrolledDown = scrollY - this._prevOffsetY > 0;
    this._prevOffsetY = this.scrollY();
    this._emiter.emit(EVENT, isScrolledDown);
  }
}
