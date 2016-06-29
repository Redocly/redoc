'use strict';

import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

@Component({
  selector: 'zippy',
  templateUrl: './zippy.html',
  styleUrls: ['./zippy.css'],
  directives: [CORE_DIRECTIVES]
})
export class Zippy {
  @Input() type = 'general';
  @Input() visible = false;
  @Input() empty = false;
  @Input() title;
  @Input() headless: boolean = false;
  @Output() open = new EventEmitter();
  @Output() close = new EventEmitter();
  toggle() {
    this.visible = !this.visible;
    if (this.empty) return;
    if (this.visible) {
      this.open.next({});
    } else {
      this.close.next({});
    }
  }
}
