'use strict';

import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';

import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { BrowserDomAdapter as DOM } from '../../../utils/browser-adapter';

import * as PS from 'perfect-scrollbar';

@Directive({
  selector: '[perfect-scrollbar]'
})
export class PerfectScrollbar implements OnInit, OnDestroy {
  $element: any;
  subscription: any;

  constructor(elementRef:ElementRef) {
    this.$element = elementRef.nativeElement;
  }

  update() {
    PS.update(this.$element);
  }

  ngOnInit() {
    requestAnimationFrame(() => PS.initialize(this.$element, {
      wheelSpeed: 2,
      wheelPropagation: false,
      minScrollbarLength: 20,
      suppressScrollX: true
    }));
  }

  ngOnDestroy() {
    PS.destroy(this.$element);
  }
}
