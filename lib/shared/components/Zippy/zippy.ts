'use strict';

import { Component, EventEmitter, Output, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'zippy',
  templateUrl: './zippy.html',
  styleUrls: ['./zippy.css']
})
export class Zippy implements OnChanges {
  @Input() type = 'general';
  @Input() empty = false;
  @Input() title;
  @Input() headless: boolean = false;
  @Input() open = false;
  @Output() openChange = new EventEmitter();


  toggle() {
    this.open = !this.open;
    if (this.empty) return;
    this.openChange.emit(this.open);
  }

  ngOnChanges(ch) {
    if (ch.open.currentValue === true) {
      this.openChange.emit(ch.open.currentValue);
    }
  }
}
