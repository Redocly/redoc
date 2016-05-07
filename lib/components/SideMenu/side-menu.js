'use strict';

import { ElementRef } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { global } from '@angular/core/src/facade/lang';

import { RedocComponent, BaseComponent, SchemaManager } from '../base';
import { ScrollService, Hash, MenuService, OptionsService } from '../../services/index';

@RedocComponent({
  selector: 'side-menu',
  templateUrl: './lib/components/SideMenu/side-menu.html',
  providers: [ScrollService, MenuService, Hash],
  styleUrls: ['./lib/components/SideMenu/side-menu.css']
})
@Reflect.metadata('parameters', [[SchemaManager], [ElementRef],
  [BrowserDomAdapter], [ScrollService], [MenuService], [Hash], [OptionsService]])
export class SideMenu extends BaseComponent {
  constructor(schemaMgr, elementRef, dom, scrollService, menuService, hash, optionsService) {
    super(schemaMgr);
    this.$element = elementRef.nativeElement;
    this.dom = dom;
    this.scrollService = scrollService;
    this.menuService = menuService;
    this.hash = hash;

    this.activeCatCaption = '';
    this.activeItemCaption = '';

    this.options = optionsService.options;

    this.menuService.changed.subscribe(this.changed.bind(this));
  }

  changed(cat, item) {
    this.activeCatCaption = cat.name || '';
    this.activeItemCaption = item && item.summary || '';
  }

  activateAndScroll(idx, methodIdx) {
    if (this.mobileMode()) {
      this.toggleMobileNav();
    }
    this.menuService.activate(idx, methodIdx);
    this.menuService.scrollToActive();
  }

  init() {
    this.$mobileNav = this.dom.querySelector(this.$element, '.mobile-nav');
    this.$resourcesNav = this.dom.querySelector(this.$element, '#resources-nav');

    //decorate option.scrollYOffset to account mobile nav
    var origOffset = this.options.scrollYOffset;
    this.options.scrollYOffset = () => {
      let mobileNavOffset = this.$mobileNav.clientHeight;
      return origOffset() + mobileNavOffset;
    };
  }

  prepareModel() {
    this.data = {};
    this.data.menu = this.menuService.categories;
  }

  mobileMode() {
    return this.$mobileNav.clientHeight > 0;
  }

  toggleMobileNav() {
    let dom = this.dom;
    let $overflowParent = (this.$scrollParent === global) ? dom.defaultDoc().body : this.$scrollParent;
    if (dom.hasStyle(this.$resourcesNav, 'height')) {
      dom.removeStyle(this.$resourcesNav, 'height');
      dom.removeStyle($overflowParent, 'overflow-y');
    } else {
      let viewportHeight = this.$scrollParent.innerHeight || this.$scrollParent.clientHeight;
      let height = viewportHeight - this.$mobileNav.getBoundingClientRect().bottom;
      dom.setStyle($overflowParent, 'overflow-y', 'hidden');
      dom.setStyle(this.$resourcesNav, 'height', height + 'px');
    }
  }

  destroy() {
    this.scrollService.unbind();
    this.hash.unbind();
  }
}
