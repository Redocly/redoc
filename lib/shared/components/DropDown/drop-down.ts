'use strict';

import { Component, EventEmitter, ElementRef, Output, Input, AfterContentInit, OnChanges } from '@angular/core';
import * as DropKick from 'dropkickjs';

@Component({
  selector: 'drop-down',
  templateUrl: 'drop-down.html',
  styleUrls: ['./drop-down.css']
})
export class DropDown implements AfterContentInit, OnChanges {
  @Output() change = new EventEmitter();
  @Input() active: string;
  elem: any;
  inst: any;
  constructor(elem:ElementRef) {
    this.elem = elem.nativeElement;
  }

  ngAfterContentInit() {
    this.inst = new DropKick(this.elem.firstElementChild, {autoWidth: true});
  }

  onChange(value) {
    this.change.next(value);
  }

  ngOnChanges(ch) {
    if (ch.active.currentValue) {
      this.inst && this.inst.select(ch.active.currentValue);
    }
  }

  destroy() {
    this.inst.dispose();
  }
}
