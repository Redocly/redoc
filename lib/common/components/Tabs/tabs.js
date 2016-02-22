'use strict';

import {Component, View, EventEmitter} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
  selector: 'tabs',
  events: ['change']
})
@View({
  template: `
    <ul>
      <li *ngFor="#tab of tabs" [ngClass]="{active: tab.active}" (click)="selectTab(tab)"
        class="tab-{{tab.tabStatus}}">{{tab.tabTitle}}</li>
    </ul>
    <ng-content></ng-content>
  `,
  directives: [CORE_DIRECTIVES],
  styleUrls: ['./lib/common/components/Tabs/tabs.css']
})
export class Tabs {
  constructor() {
    this.tabs = [];
    this.change = new EventEmitter();
  }

  selectTab(tab, notify = true) {
    if (tab.active) return;
    this.tabs.forEach((tab) => {
      tab.active = false;
    });
    tab.active = true;
    notify && this.change.next(tab.tabTitle);
  }

  selectyByTitle(tabTitle, notify = false) {
    let prevActive;
    let newActive;
    this.tabs.forEach((tab) => {
      if (tab.active) prevActive = tab;
      tab.active = false;
      if (tab.tabTitle === tabTitle) {
        newActive = tab;
      }
    });
    if (newActive) {
      newActive.active = true;
    } else {
      prevActive.active = true;
    }
    notify && this.change.next(tabTitle);
  }

  addTab(tab) {
    if (this.tabs.length === 0) {
      tab.active = true;
    }
    this.tabs.push(tab);
  }
}

@Component({
  selector: 'tab',
  inputs: ['tabTitle', 'tabStatus']
})
@View({
  template: `
    <div class="tab-wrap" [ngClass]="{ 'active': active }">
      <ng-content></ng-content>
    </div>
  `,
  directives: [CORE_DIRECTIVES],
  styles: [`
    .tab-wrap {
      display: none;
    }

    .tab-wrap.active {
      display: block;
    }`
  ]
})
@Reflect.metadata('parameters', [ [Tabs] ])
export class Tab {
  constructor(tabs) {
    this.active = false;
    tabs.addTab(this);
  }
}
