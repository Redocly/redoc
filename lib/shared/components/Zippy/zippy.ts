'use strict';

import { Component, EventEmitter, Output, Input,
   trigger, state, animate, transition, style } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

@Component({
  selector: 'zippy',
  templateUrl: './zippy.html',
  styleUrls: ['./zippy.css'],
  directives: [CORE_DIRECTIVES],
  animations: [
    trigger('openClose', [
      state('collapsed, void',
        style({ height: '0px' })),
      state('expanded',
        style({ height: '*' })),
      transition('collapsed <=> expanded', [
        animate(200)
      ])
    ])
  ],
})
export class Zippy {
  @Input() type = 'general';
  @Input() visible = false;
  @Input() empty = false;
  @Input() title;
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
