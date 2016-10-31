'use strict';

import { Component, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';

//import { global } from '@angular/core/src/facade/lang';
import { trigger, state, animate, transition, style } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import { ScrollService, Hash, MenuService, OptionsService } from '../../services/index';
import { BrowserDomAdapter as DOM } from '../../utils/browser-adapter';
import { MenuCategory } from '../../services/schema-helper.service';

const global = window;

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.html',
  styleUrls: ['./side-menu.css'],
  animations: [
    trigger('itemAnimation', [
      state('collapsed, void',
        style({ height: '0px' })),
      state('expanded',
        style({ height: '*' })),
      transition('collapsed <=> expanded', [
        animate('200ms ease')
      ])
    ])
  ],
})
export class SideMenu extends BaseComponent implements OnInit {
  activeCatCaption: string;
  activeItemCaption: string;
  categories: Array<MenuCategory>;

  private options: any;
  private $element: any;
  private $mobileNav: any;
  private $resourcesNav: any;
  private $scrollParent: any;

  constructor(specMgr:SpecManager, elementRef:ElementRef,
  private scrollService:ScrollService, private menuService:MenuService, private hash:Hash,
  optionsService:OptionsService, private detectorRef:ChangeDetectorRef) {
    super(specMgr);
    this.$element = elementRef.nativeElement;

    this.activeCatCaption = '';
    this.activeItemCaption = '';

    this.options = optionsService.options;

    this.menuService.changed.subscribe((evt) => this.changed(evt));
  }

  changed({cat, item}) {
    this.activeCatCaption = cat.name || '';
    this.activeItemCaption = item && item.summary || '';

    //safari doesn't update bindings if not run changeDetector manually :(

    this.detectorRef.detectChanges();
  }

  activateAndScroll(idx, methodIdx) {
    if (this.mobileMode()) {
      this.toggleMobileNav();
    }
    this.menuService.activate(idx, methodIdx);
    this.menuService.scrollToActive();
  }

  init() {
    this.categories = this.menuService.categories;

    this.$mobileNav = DOM.querySelector(this.$element, '.mobile-nav');
    this.$resourcesNav = DOM.querySelector(this.$element, '#resources-nav');

    //decorate scrollYOffset to account mobile nav
    this.scrollService.scrollYOffset = () => {
      let mobileNavOffset = this.$mobileNav.clientHeight;
      return this.options.scrollYOffset() + mobileNavOffset;
    };
  }

  mobileMode() {
    return this.$mobileNav.clientHeight > 0;
  }

  toggleMobileNav() {
    let $overflowParent = (this.options.$scrollParent === global) ? DOM.defaultDoc().body
      : this.$scrollParent;
    if (DOM.hasStyle(this.$resourcesNav, 'height')) {
      DOM.removeStyle(this.$resourcesNav, 'height');
      DOM.removeStyle($overflowParent, 'overflow-y');
    } else {
      let viewportHeight = this.options.$scrollParent.innerHeight
       || this.options.$scrollParent.clientHeight;
      let height = viewportHeight - this.$mobileNav.getBoundingClientRect().bottom;
      DOM.setStyle($overflowParent, 'overflow-y', 'hidden');
      DOM.setStyle(this.$resourcesNav, 'height', height + 'px');
    }
  }

  destroy() {
    this.scrollService.unbind();
  }

  ngOnInit() {
    this.preinit();
  }
}
