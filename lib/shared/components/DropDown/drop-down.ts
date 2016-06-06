'use strict';

import {Component, EventEmitter, ElementRef, Output} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import DropKick from 'dropkickjs';

@Component({
  selector: 'dropdown',
  template: `
    <select (change)=onChange($event.target.value)>
      <ng-content></ng-content>
    </select>
  `,
  directives: [CORE_DIRECTIVES],
  styleUrls: ['./drop-down.css']
})
export class DropDown {
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
