'use strict';

import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { BrowserDomAdapter as DOM } from '../../../utils/browser-adapter';

@Directive({
  selector: '[sticky-sidebar]'
})
export class StickySidebar implements OnInit, OnDestroy {
  $element: any;
  cancelScrollBinding: any;
  $redocEl: any;
  @Input() scrollParent:any;
  @Input() scrollYOffset:any;

  constructor(elementRef:ElementRef) {
    this.$element = elementRef.nativeElement;

    // initial styling
    DOM.setStyle(this.$element, 'position', 'absolute');
    DOM.setStyle(this.$element, 'top', '0');
    DOM.setStyle(this.$element, 'bottom', '0');
    DOM.setStyle(this.$element, 'max-height', '100%');
  }

  bind() {
    this.cancelScrollBinding = DOM.onAndCancel(this.scrollParent, 'scroll', () => { this.updatePosition(); });
  }

  unbind() {
    if (this.cancelScrollBinding) this.cancelScrollBinding();
  }

  updatePosition() {
    if ( this.scrollY + this.scrollYOffset() >= this.$redocEl.offsetTop) {
      this.stick();
    } else {
      this.unstick();
    }
  }

  stick() {
    DOM.setStyle(this.$element, 'position', 'fixed');
    DOM.setStyle(this.$element, 'top', this.scrollYOffset() + 'px');
  }

  unstick() {
    DOM.setStyle(this.$element, 'position', 'absolute');
    DOM.setStyle(this.$element, 'top', '0');
  }

  get scrollY() {
    return (this.scrollParent.pageYOffset != undefined) ? this.scrollParent.pageYOffset : this.scrollParent.scrollTop;
  }

  ngOnInit() {
    // FIXME use more reliable code
    this.$redocEl = this.$element.offsetParent.parentNode || DOM.defaultDoc().body;
    this.bind();
    this.updatePosition();
  }

  ngOnDestroy() {
    this.unbind();
  }
}
