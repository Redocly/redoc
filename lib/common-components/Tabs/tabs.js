'use strict';

import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';

@Component({
  selector: 'tabs'
})
@View({
  template: `
    <ul>
      <li *ng-for="#tab of tabs" [ng-class]="{active: tab.active}" (click)="selectTab(tab)">{{tab.tabTitle}}</li>
    </ul>
    <ng-content></ng-content>
  `,
  directives: [CORE_DIRECTIVES],
  styleUrls: ['./lib/common-components/Tabs/tabs.css']
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

  addTab(tab: Tab) {
    if (this.tabs.length === 0) {
      tab.active = true;
    }
    this.tabs.push(tab);
  }
}

@Component({
  selector: 'tab',
  inputs: ['tabTitle: tab-title']
})
@View({
  template: `
    <div class="tab-wrap" [hidden]="!active">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .tab-wrap {
      padding: 5px;
      background-color: #771D1D;
    }
  `]
})
export class Tab {
  constructor(tabs) {
    tabs.addTab(this);
  }
}

Tab.parameters = [ [ Tabs ] ];
