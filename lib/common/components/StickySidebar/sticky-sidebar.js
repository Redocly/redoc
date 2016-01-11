'use strict';

import {Component, View, OnInit, OnDestroy, ElementRef} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';

@Component({
  selector: 'sticky-sidebar',
  inputs: ['scrollParent', 'scrollYOffset']
})
@View({
  template: `
    <div class="sticky-sidebar">
      <ng-content></ng-content>
    </div>
  `,
  lifecycle: [OnInit, OnDestroy]
})
export default class StickySidebar {
  constructor(elementRef, adapter) {
    this.element = elementRef.nativeElement;
    this.adapter = adapter;

    // initial styling
    this.adapter.setStyle(this.element, 'position', 'absolute');
    this.adapter.setStyle(this.element, 'top', '0');
    this.adapter.setStyle(this.element, 'bottom', '0');
    this.adapter.setStyle(this.element, 'max-height', '100%');
  }

  bind() {
    this.cancelScrollBinding = this.adapter.onAndCancel(this.scrollParent, 'scroll', () => { this.updatePosition(); });
    this.updatePosition();
  }

  unbind() {
    this.cancelScrollBinding && this.cancelScrollBinding();
  }

  updatePosition() {
    if ( this.scrollY + this.scrollYOffset() >= this.redocEl.offsetTop) {
      this.stick();
    } else {
      this.unstick();
    }
  }

  stick() {
    this.adapter.setStyle(this.element, 'position', 'fixed');
    this.adapter.setStyle(this.element, 'top', this.scrollYOffset() + 'px');
  }

  unstick() {
    this.adapter.setStyle(this.element, 'position', 'absolute');
    this.adapter.setStyle(this.element, 'top', 0);
  }

  get scrollY() {
    return this.scrollParent.scrollY || this.scrollParent.scrollTop || 0;
  }

  ngOnInit() {
    this.redocEl = this.element.offsetParent;
    this.bind();
  }

  ngOnDestroy() {
    this.unbind();
  }
}

StickySidebar.parameters = [ [ElementRef], [BrowserDomAdapter] ];
