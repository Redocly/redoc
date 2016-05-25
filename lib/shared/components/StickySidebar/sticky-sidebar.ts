'use strict';

import {Directive, ElementRef, Input} from '@angular/core';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';

@Directive({
  selector: '[sticky-sidebar]',
  inputs: ['scrollParent', 'scrollYOffset']
})
export class StickySidebar {
  $element: any;
  cancelScrollBinding: any;
  $redocEl: any;
  @Input() scrollParent:any;
  @Input() scrollYOffset:any;
  
  constructor(elementRef:ElementRef, private dom:BrowserDomAdapter) {
    this.$element = elementRef.nativeElement;

    // initial styling
    this.dom.setStyle(this.$element, 'position', 'absolute');
    this.dom.setStyle(this.$element, 'top', '0');
    this.dom.setStyle(this.$element, 'bottom', '0');
    this.dom.setStyle(this.$element, 'max-height', '100%');
  }

  bind() {
    this.cancelScrollBinding = this.dom.onAndCancel(this.scrollParent, 'scroll', () => { this.updatePosition(); });
    this.updatePosition();
  }

  unbind() {
    this.cancelScrollBinding && this.cancelScrollBinding();
  }

  updatePosition() {
    if ( this.scrollY + this.scrollYOffset() >= this.$redocEl.offsetTop) {
      this.stick();
    } else {
      this.unstick();
    }
  }

  stick() {
    this.dom.setStyle(this.$element, 'position', 'fixed');
    this.dom.setStyle(this.$element, 'top', this.scrollYOffset() + 'px');
  }

  unstick() {
    this.dom.setStyle(this.$element, 'position', 'absolute');
    this.dom.setStyle(this.$element, 'top', '0');
  }

  get scrollY() {
    return (this.scrollParent.pageYOffset != null) ? this.scrollParent.pageYOffset : this.scrollParent.scrollTop;
  }

  ngOnInit() {
    // FIXME use more reliable code
    this.$redocEl = this.$element.offsetParent || this.dom.defaultDoc().body;
    this.bind();
  }

  ngOnDestroy() {
    this.unbind();
  }
}
