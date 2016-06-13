'use strict';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tabs',
  template: `
    <ul>
      <li *ngFor="let tab of tabs" [ngClass]="{active: tab.active}" (click)="selectTab(tab)"
        class="tab-{{tab.tabStatus}}">{{tab.tabTitle}}</li>
    </ul>
    <ng-content></ng-content>
  `,
  directives: [CORE_DIRECTIVES],
  styleUrls: ['tabs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tabs {
  @Input() selected: any;
  @Output() change = new EventEmitter();
  tabs: Tab[] = [];
  constructor(private changeDetector:ChangeDetectorRef) {}

  selectTab(tab, notify = true) {
    if (tab.active) return;
    this.tabs.forEach((tab) => {
      tab.active = false;
    });
    tab.active = true;
    if (notify) this.change.next(tab.tabTitle);
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
    if (notify) this.change.next(tabTitle);
    this.changeDetector.markForCheck();
  }

  addTab(tab) {
    if (this.tabs.length === 0) {
      tab.active = true;
    }
    this.tabs.push(tab);
  }

  ngOnInit() {
    if (this.selected) this.selected.subscribe(title => this.selectyByTitle(title));
  }
}

@Component({
  selector: 'tab',
  template: `
    <div class="tab-wrap" [ngClass]="{'active': active}">
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
export class Tab {
  @Input() active: boolean = false;
  @Input() tabTitle: string;
  @Input() tabStatus: string;
  constructor(tabs: Tabs) {
    tabs.addTab(this);
  }
}
