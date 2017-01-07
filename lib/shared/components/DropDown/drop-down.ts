'use strict';

import { Component, EventEmitter, ElementRef, Output, AfterContentInit } from '@angular/core';
import * as DropKick from 'dropkickjs';

@Component({
  selector: 'drop-down',
  templateUrl: 'drop-down.html',
  styleUrls: ['./drop-down.css']
})
export class DropDown implements AfterContentInit {
  @Output() change = new EventEmitter();
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

  destroy() {
    this.inst.dispose();
  }
}
