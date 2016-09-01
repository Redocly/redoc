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
    var stuck = false;
    if ( this.scrollY + this.scrollYOffset() >= this.$redocEl.offsetTop) {
      this.stick();
      stuck = true;
    } else {
      this.unstick();
    }

    if ( this.scrollY + window.innerHeight -  this.scrollYOffset() >= this.$redocEl.scrollHeight) {
      this.stickBottom();
      stuck = true;
    } else {
      this.unstickBottom();
    }

    if (!stuck) {
      DOM.setStyle(this.$element, 'position', 'absolute');
    }
  }

  stick() {
    DOM.setStyle(this.$element, 'position', 'fixed');
    DOM.setStyle(this.$element, 'top', this.scrollYOffset() + 'px');
  }

  unstick() {
    DOM.setStyle(this.$element, 'top', '0');
  }

  stickBottom() {
    DOM.setStyle(this.$element, 'position', 'fixed');
    var offset = this.scrollY + this.scrollParentHeight - (this.$redocEl.scrollHeight + this.$redocEl.offsetTop);
    DOM.setStyle(this.$element, 'bottom', offset + 'px');
  }

  unstickBottom() {
    DOM.setStyle(this.$element, 'bottom', '0');
  }

  get scrollY() {
    return (this.scrollParent.pageYOffset != undefined) ? this.scrollParent.pageYOffset : this.scrollParent.scrollTop;
  }

  get scrollParentHeight() {
    return (this.scrollParent.innerHeight != undefined) ? this.scrollParent.innerHeight : this.scrollParent.clientHeight;
  }

  ngOnInit() {
    // FIXME use more reliable code
    this.$redocEl = this.$element.offsetParent.parentNode || DOM.defaultDoc().body;
    this.bind();
    setTimeout(() => this.updatePosition());
    //this.updatePosition()
  }

  ngOnDestroy() {
    this.unbind();
  }
}
