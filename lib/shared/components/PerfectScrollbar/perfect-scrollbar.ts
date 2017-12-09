import 'perfect-scrollbar/dist/css/perfect-scrollbar.css';

import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as PS from 'perfect-scrollbar';

import { OptionsService } from '../../../services/options.service';

@Directive({
  selector: '[perfect-scrollbar]',
})
export class PerfectScrollbar implements OnInit, OnDestroy {
  $element: any;
  subscription: any;
  enabled: boolean = true;

  constructor(elementRef: ElementRef, optionsService: OptionsService) {
    this.$element = elementRef.nativeElement;
    this.enabled = !optionsService.options.nativeScrollbars;
  }

  update() {
    if (!this.enabled) return;
    PS.update(this.$element);
  }

  ngOnInit() {
    if (!this.enabled) return;
    requestAnimationFrame(() =>
      PS.initialize(this.$element, {
        wheelSpeed: 2,
        handlers: [
          'click-rail',
          'drag-scrollbar',
          'keyboard',
          'wheel',
          'touch',
        ],
        wheelPropagation: true,
        minScrollbarLength: 20,
        suppressScrollX: true,
      } as any),
    );
  }

  ngOnDestroy() {
    if (!this.enabled) return;
    PS.destroy(this.$element);
  }
}
