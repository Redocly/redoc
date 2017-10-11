import { debounce, bind } from 'decko';
import { EventEmitter } from 'eventemitter3';

const EVENT = 'scroll';

export class ScrollService {
  private _scrollParent: Window | HTMLElement;
  private _emiter: EventEmitter;
  private _prevOffsetY: number = 0;
  constructor() {
    this._scrollParent = window;
    this._emiter = new EventEmitter();
    this.bind();
  }

  bind() {
    this._prevOffsetY = this.scrollY();
    this._scrollParent.addEventListener('scroll', this.handleScroll);
  }

  dispose() {
    this._scrollParent.removeEventListener('scroll', this.handleScroll);
    this._emiter.removeAllListeners(EVENT);
  }

  scrollY(): number {
    if (this._scrollParent === window) {
      return window.pageYOffset;
    } else if (this._scrollParent instanceof HTMLElement) {
      return this._scrollParent.scrollTop;
    } else {
      return 0;
    }
  }

  isElementBellow(el: Element | null) {
    if (el === null) return;
    return el.getBoundingClientRect().top > 0;
  }

  isElementAbove(el: Element | null) {
    if (el === null) return;
    return Math.trunc(el.getBoundingClientRect().top) <= 0;
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
  }

  scrollIntoViewBySelector(selector: string) {
    const element = document.querySelector(selector);
    this.scrollIntoView(element);
  }

  @bind
  @debounce(100)
  handleScroll() {
    const scrollY = this.scrollY();
    const isScrolledDown = scrollY - this._prevOffsetY > 0;
    this._prevOffsetY = this.scrollY();
    this._emiter.emit(EVENT, isScrolledDown);
  }
}
