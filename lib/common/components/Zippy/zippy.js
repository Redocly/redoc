'use strict';

import {Component, View, EventEmitter, CORE_DIRECTIVES} from 'angular2/angular2';

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
export class Zippy {

  constructor() {
    this.type = 'general';
    this.visible = false;
    this.open = new EventEmitter();
    this.close = new EventEmitter();
  }

  toggle() {
    this.visible = !this.visible;
    (this.visible) ? this.open.next() : this.close.next();
  }
}
