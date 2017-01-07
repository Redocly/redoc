'use strict';

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html',
  styleUrls: ['tabs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tabs implements OnInit {
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
  templateUrl: 'tab.html',
  styleUrls: ['tab.css']
})
export class Tab {
  @Input() active: boolean = false;
  @Input() tabTitle: string;
  @Input() tabStatus: string;
  constructor(tabs: Tabs) {
    tabs.addTab(this);
  }
}
