'use strict';

import {Component, View, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
  selector: 'zippy',
  events: ['open', 'close'],
  inputs: ['title', 'visible', 'type', 'empty']
})
@View({
  templateUrl: './lib/common/components/Zippy/zippy.html',
  styleUrls: ['./lib/common/components/Zippy/zippy.css'],
  directives: [CORE_DIRECTIVES]
})
export default class Zippy {

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
