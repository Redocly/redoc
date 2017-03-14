'use strict';

import { Directive, Input, HostListener, Renderer, ElementRef, OnInit} from '@angular/core';
import { Clipboard } from '../../../services/clipboard.service';

@Directive({
  selector: '[copy-button]'
})
export class CopyButton implements OnInit {
  $element: any;
  cancelScrollBinding: any;
  $redocEl: any;
  @Input() copyText: string;
  @Input() copyElement:any;
  @Input() hintElement:any;

  constructor(private renderer: Renderer, private element: ElementRef) {}

  ngOnInit () {
    if (!Clipboard.isSupported()) {
      this.element.nativeElement.parentNode.removeChild(this.element.nativeElement);
    }
    this.renderer.setElementAttribute(this.element.nativeElement, 'data-hint', 'Copy to Clipboard!');
  }

  @HostListener('click')
  onClick() {
    let copied;
    if (this.copyText) {
      copied = Clipboard.copyCustom(JSON.stringify(this.copyText, null, 2));
    } else {
      copied = Clipboard.copyElement(this.copyElement);
    }

    if (copied) {
      this.renderer.setElementAttribute(this.element.nativeElement, 'data-hint', 'Copied!');
    } else {
      let hintElem = this.hintElement || this.copyElement;
      if (!hintElem) return;
      this.renderer.setElementAttribute(hintElem, 'data-hint', 'Press "ctrl + c" to copy');
      this.renderer.setElementClass(hintElem, 'hint--top', true);
      this.renderer.setElementClass(hintElem, 'hint--always', true);
    }
  }

  @HostListener('mouseleave')
  onLeave() {
    setTimeout(() => {
      this.renderer.setElementAttribute(this.element.nativeElement, 'data-hint', 'Copy to Clipboard');
    }, 500);
  }
}
