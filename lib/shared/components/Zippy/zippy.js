'use strict';

import {Component, EventEmitter} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';

@Component({
  selector: 'zippy',
  events: ['open', 'close'],
  inputs: ['title', 'visible', 'type', 'empty'],
  templateUrl: './lib/shared/components/Zippy/zippy.html',
  styleUrls: ['./lib/shared/components/Zippy/zippy.css'],
  directives: [CORE_DIRECTIVES]
})
export class Zippy {

  constructor() {
    this.type = 'general';
    this.visible = false;
    this.empty = false;
    this.open = new EventEmitter();
    this.close = new EventEmitter();
  }

  toggle() {
    this.visible = !this.visible;
    if (this.empty) return;
    (this.visible) ? this.open.next() : this.close.next();
  }
}
