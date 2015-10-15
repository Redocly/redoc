'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {SchemaManager} from '../../utils/SchemaManager';
import {methods as swaggerMethods} from  '../../utils/swagger-defs';
import {JsonPointer} from '../../utils/JsonPointer';
import {SideMenuCat} from '../SideMenuCat/side-menu-cat';
import {NgZone} from 'angular2/angular2';

const CHANGE = {
  NEXT : 1,
  BACK : -1,
  HOLD : 0
};

@RedocComponent({
  selector: 'side-menu',
  bindings: [SchemaManager],
  templateUrl: './lib/components/SideMenu/side-menu.html',
  directives: [SideMenuCat]
})
export class SideMenu extends BaseComponent {
  constructor(schemaMgr, zone) {
    super(schemaMgr);
    this.zone = zone;
    this.zone.run(() => {
      this.bindScroll();
    });

    this.activeCatIdx = 0;
    this.activeMethodIdx = 0;
    this.prevOffsetY = null;
  }

  _updateActiveMethod(offset) {
    let menu = this.data.menu;
    let catCount = menu.length;
    let catLength = menu[this.activeCatIdx].methods.length;
    this.activeMethodIdx += offset;

    if (this.activeMethodIdx > catLength - 1) {
      this.activeCatIdx++;
      this.activeMethodIdx = 0;
    }
    if (this.activeMethodIdx < 0) {
      let prevCatIdx = --this.activeCatIdx;
      catLength = menu[Math.max(prevCatIdx, 0)].methods.length;
      this.activeMethodIdx = catLength - 1;
    }
    if (this.activeCatIdx > catCount - 1) {
      this.activeCatIdx = catCount - 1;
      this.activeMethodIdx = catLength - 1;
    }
    if (this.activeCatIdx < 0) {
      this.activeCatIdx = 0;
      this.activeMethodIdx = 0;
    }
  }

  changeActive(offset = 1) {
    let menu = this.data.menu;
    menu[this.activeCatIdx].methods[this.activeMethodIdx].active = false;
    menu[this.activeCatIdx].active = false;

    this._updateActiveMethod(offset);

    menu[this.activeCatIdx].active = true;
    let currentItem = menu[this.activeCatIdx].methods[this.activeMethodIdx];
    currentItem.active = true;
    this.activeMethodPtr = currentItem.pointer;
  }

  scrollHandler() {
    let isScrolledDown = (window.scrollY - this.prevOffsetY > 0);
    this.prevOffsetY = window.scrollY;
    let ptr = this.activeMethodPtr;
    var activeMethodHost = document.querySelector(`[pointer="${ptr}"]`);
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

  bindScroll() {
    this.prevOffsetY = window.scrollY;
    window.addEventListener('scroll', () => this.scrollHandler());
  }

  prepareModel() {
    this.data = {};
    this.data.menu = Array.from(this.buildMenuTree().entries()).map(
      el => ({name: el[0], methods: el[1]})
    );
    this.changeActive(CHANGE.HOLD);
  }

  buildMenuTree() {
    let tag2MethodMapping = new Map();
    let paths = this.componentSchema.paths;
    for (let path of Object.keys(paths)) {
      let methods = Object.keys(paths[path]).filter((k) => swaggerMethods.has(k));
      for (let method of methods) {
        let methodInfo = paths[path][method];
        let tags = methodInfo.tags;

        //TODO: mb need to do something cleverer
        if (!tags || !tags.length) {
          tags = ['[Other]'];
        }
        let methodPointer = JsonPointer.compile(['paths', path, method]);
        let methodSummary = methodInfo.summary;
        for (let tag of tags) {
          let tagMethods = tag2MethodMapping.get(tag);
          if (!tagMethods) {
            tagMethods = [];
            tag2MethodMapping.set(tag, tagMethods);
          }

          tagMethods.push({pointer: methodPointer, summary: methodSummary});
        }
      }
    }
    return tag2MethodMapping;
  }
}
SideMenu.parameters.push([NgZone]);
