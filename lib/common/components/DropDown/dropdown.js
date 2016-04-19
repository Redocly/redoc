'use strict';

import {Component, EventEmitter, ElementRef} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import DropKick from 'Robdel12/DropKick';
import 'Robdel12/DropKick/build/css/dropkick.css!css';

@Component({
  selector: 'dropdown',
  events: ['change'],
  template: `
    <select (change)=onChange($event.target.value)>
      <ng-content></ng-content>
    </select>
  `,
  directives: [CORE_DIRECTIVES],
  styleUrls: ['./lib/common/components/DropDown/dropdown.css']
})
@Reflect.metadata('parameters', [[ElementRef]])
export class DropDown {
  constructor(elem) {
    this.change = new EventEmitter();
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
