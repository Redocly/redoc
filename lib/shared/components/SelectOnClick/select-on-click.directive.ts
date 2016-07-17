'use strict';

import { Directive, HostListener, ElementRef} from '@angular/core';
import { Clipboard } from '../../../services/clipboard.service';

@Directive({
  selector: '[select-on-click]'
})
export class SelectOnClick {
  $element: any;
  constructor(private element: ElementRef) {}

  @HostListener('click')
  onClick() {
    Clipboard.selectElement(this.element.nativeElement);
  }
}
