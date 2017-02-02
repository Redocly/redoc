import { Injectable } from '@angular/core';
import * as Mark from 'mark.js';
import { MenuService } from './menu.service';

const ROLL_LEN = 5;
@Injectable()
export class Marker {
  permInstances = [];
  rolledInstances = new Array(ROLL_LEN);
  term: string;

  currIdx = -1;

  constructor(private menu: MenuService) {
    menu.changedActiveItem.subscribe(() => {
      this.roll();
    });
  }

  addElement(el: Element) {
    this.permInstances.push(new Mark(el));
  }

  newMarkerAtMenuItem(idx:number) {
    let context = this.menu.getEl(idx);

    if (this.menu.isTagOrGroupItem(idx)) {
      context = this.menu.getTagInfoEl(idx);
    }
    let newInst = context && new Mark(context);
    if (newInst && this.term) {
      newInst.mark(this.term);
    }
    return newInst;
  }

  roll() {
    let newIdx = this.menu.activeIdx;
    let diff = newIdx - this.currIdx;
    this.currIdx = newIdx;
    if (diff < 0) {
      diff = - diff;
      for (let i=0; i < Math.min(diff, ROLL_LEN); i++) {
        let prevInst = this.rolledInstances.pop();
        if(prevInst) prevInst.unmark();

        let idx = newIdx - Math.floor(ROLL_LEN/2) + i;
        let newMark = this.newMarkerAtMenuItem(idx);
        this.rolledInstances.unshift(newMark);
      }
    } else {
      for (let i=0; i < Math.min(diff, ROLL_LEN); i++) {
        let oldInst = this.rolledInstances.shift();
        if (oldInst) oldInst.unmark();

        let idx = newIdx + Math.floor(ROLL_LEN/2) - i;
        let newMark = this.newMarkerAtMenuItem(idx);
        this.rolledInstances.push(newMark);
      }
    }
  }

  mark(term: string) {
    this.term = term || null;
    this.remark();
  }

  remark() {
    for (let marker of this.permInstances) {
      if (marker) {
        marker.unmark();
        if (this.term) marker.mark(this.term);
      }
    }
    for (let marker of this.rolledInstances) {
      if (marker) {
        marker.unmark();
        if (this.term) marker.mark(this.term);
      }
    }
  }

  unmark() {
    this.term = null;
    this.remark();
  }
}
