'use strict';

import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';

@Component({
  selector: 'tabs'
})
@View({
  template: `
    <ul>
      <li *ngFor="#tab of tabs" [ngClass]="{active: tab.active}" (click)="selectTab(tab)"
        class="tab-{{tab.tabStatus}}"> {{tab.tabTitle}}
      </li>
    </ul>
    <ng-content></ng-content>
  `,
  directives: [CORE_DIRECTIVES],
  styleUrls: ['./lib/common/components/Tabs/tabs.css']
})
export class Tabs {
  constructor() {
    this.tabs = [];
  }

  selectTab(tab) {
    this.tabs.forEach((tab) => {
      tab.active = false;
    });
    tab.active = true;
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
    <div class="tab-wrap" [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `
})
export class Tab {
  constructor(tabs) {
    tabs.addTab(this);
  }
}

Tab.parameters = [ [ Tabs ] ];
