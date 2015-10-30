'use strict';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';
import SideMenuCat from '../SideMenuCat/side-menu-cat';
import {NgZone} from 'angular2/angular2';

const CHANGE = {
  NEXT : 1,
  BACK : -1,
  INITIAL : 0
};

@RedocComponent({
  selector: 'side-menu',
  providers: [SchemaManager],
  templateUrl: './lib/components/SideMenu/side-menu.html',
  styleUrls: ['./lib/components/SideMenu/side-menu.css'],
  directives: [SideMenuCat]
})
export default class SideMenu extends BaseComponent {
  constructor(schemaMgr, zone) {
    super(schemaMgr);
    this.zone = zone;

    // for some reason constructor is not run inside zone
    // as workaround running it manually
    this.zone.run(() => {
      this.bindScroll();
    });

    this.activeCatIdx = 0;
    this.activeMethodIdx = -1;
    this.prevOffsetY = null;
  }

  bindScroll() {
    this.prevOffsetY = window.scrollY;
    window.addEventListener('scroll', () => this.scrollHandler());
  }


  activateAndScroll(idx, methodIdx) {
    this.activate(idx, methodIdx);
    this.scrollToActive();
  }

  scrollToActive() {
    let subjRect = this.getMethodEl().getBoundingClientRect();
    let offset = window.scrollY + subjRect.top;
    window.scrollTo(0, offset);
  }

  activate(catIdx, methodIdx) {
    let menu = this.data.menu;
    menu[this.activeCatIdx].active = false;
    if (menu[this.activeCatIdx].methods.length) {
      if (this.activeMethodIdx >= 0) {
        menu[this.activeCatIdx].methods[this.activeMethodIdx].active = false;
      }
   }

    this.activeCatIdx = catIdx;
    this.activeMethodIdx = methodIdx;
    menu[catIdx].active = true;
    this.activeMethodPtr = null;
    if (menu[catIdx].methods.length && (methodIdx > -1)) {
      let currentItem = menu[catIdx].methods[methodIdx];
      currentItem.active = true;
      this.activeMethodPtr = currentItem.pointer;
    }
  }

  _calcActiveIndexes(offset) {
    let menu = this.data.menu;
    let catCount = menu.length;
    let catLength = menu[this.activeCatIdx].methods.length;

    let resMethodIdx = this.activeMethodIdx + offset;
    let resCatIdx = this.activeCatIdx;

    if (resMethodIdx > catLength - 1) {
      resCatIdx++;
      resMethodIdx = -1;
    }
    if (resMethodIdx < -1) {
      let prevCatIdx = --resCatIdx;
      catLength = menu[Math.max(prevCatIdx, 0)].methods.length;
      resMethodIdx = catLength - 1;
    }
    if (resCatIdx > catCount - 1) {
      resCatIdx = catCount - 1;
      resMethodIdx = catLength - 1;
    }
    if (resCatIdx < 0) {
      resCatIdx = 0;
      resMethodIdx = 0;
    }

    return [resCatIdx, resMethodIdx];
  }

  changeActive(offset = 1) {
    let [catIdx, methodIdx] = this._calcActiveIndexes(offset);
    this.activate(catIdx, methodIdx);
  }

  getMethodEl() {
    let ptr = this.activeMethodPtr;
    let tag = this.data.menu[this.activeCatIdx].name;
    let selector = ptr ? `[pointer="${ptr}"][tag="${tag}"]` : `[tag="${tag}"]`;
    return document.querySelector(selector);
  }

  scrollHandler() {
    let isScrolledDown = (window.scrollY - this.prevOffsetY > 0);
    this.prevOffsetY = window.scrollY;
    var activeMethodHost = this.getMethodEl();
    if (!activeMethodHost) return;

    if(isScrolledDown && activeMethodHost.getBoundingClientRect().bottom <= 0 ) {
      this.changeActive(CHANGE.NEXT);
      return;
    }
    if(!isScrolledDown && activeMethodHost.getBoundingClientRect().top > 0 ) {
      this.changeActive(CHANGE.BACK);
      return;
    }
  }

  prepareModel() {
    this.data = {};
    this.data.menu = Array.from(this.schemaMgr.buildMenuTree().entries()).map(
      el => ({name: el[0], description: el[1].description, methods: el[1].methods})
    );
  }

  init() {
    this.changeActive(CHANGE.INITIAL);
  }
}
SideMenu.parameters = SideMenu.parameters.concat([NgZone]);
