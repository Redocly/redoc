'use strict';

import { Component, EventEmitter, Input, Output, ElementRef, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

//import { global } from '@angular/core/src/facade/lang';
import { trigger, state, animate, transition, style } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import { ScrollService, MenuService, OptionsService, MenuItem, Marker} from '../../services/';
import { BrowserDomAdapter as DOM } from '../../utils/browser-adapter';

const global = window;

@Component({
  selector: 'side-menu-items',
  templateUrl: './side-menu-items.html',
  styleUrls: ['./side-menu-items.css'],
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
  ]
})
export class SideMenuItems {
  @Input() items: MenuItem[];
  @Output() activate = new EventEmitter<MenuItem>();

  activateItem(item) {
    this.activate.next(item);
  }
}

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.html',
  styleUrls: ['./side-menu.css']
})
export class SideMenu extends BaseComponent implements OnInit, OnDestroy {
  activeCatCaption: string;
  activeItemCaption: string;
  menuItems: Array<MenuItem>;

  private options: any;
  private $element: any;
  private $mobileNav: any;
  private $resourcesNav: any;
  private $scrollParent: any;

  private firstChange = true;

  constructor(specMgr:SpecManager, elementRef:ElementRef,
  private scrollService:ScrollService, private menuService:MenuService,
  optionsService:OptionsService, private detectorRef:ChangeDetectorRef, private marker:Marker) {
    super(specMgr);
    this.$element = elementRef.nativeElement;

    this.activeCatCaption = '';
    this.activeItemCaption = '';

    this.options = optionsService.options;

    this.menuService.changedActiveItem.subscribe((evt) => this.changed(evt));
    this.menuService.changed.subscribe((evt) => this.detectorRef.detectChanges());
  }

  changed(item) {
    if (!item) {
      this.activeCatCaption = '';
      this.activeItemCaption = '';
      return;
    }
    if (item.parent) {
      this.activeItemCaption = item.name;
      this.activeCatCaption =  item.parent.name;
    } else {
      this.activeCatCaption = item.name;
      this.activeItemCaption = '';
    }

    //safari doesn't update bindings if not run changeDetector manually :(
    this.detectorRef.detectChanges();
    if (this.firstChange) {
      this.scrollActiveIntoView();
      this.firstChange = false;
    }
  }

  scrollActiveIntoView() {
    let $item = this.$element.querySelector('li.active, label.active');
    if ($item) $item.scrollIntoView();
  }

  activateAndScroll(item) {
    if (this.mobileMode) {
      this.toggleMobileNav();
    }

    this.menuService.activate(item.flatIdx);
    this.menuService.scrollToActive();
  }

  init() {
    this.menuItems = this.menuService.items;

    this.$mobileNav = DOM.querySelector(this.$element, '.mobile-nav');
    this.$resourcesNav = DOM.querySelector(this.$element, '#resources-nav');

    //decorate scrollYOffset to account mobile nav
    this.scrollService.scrollYOffset = () => {
      let mobileNavOffset = this.$mobileNav.clientHeight;
      return this.options.scrollYOffset() + mobileNavOffset;
    };
  }

  get mobileMode() {
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
    this.menuService.destroy();
  }

  ngOnDestroy() {
    this.destroy();
  }

  ngOnInit() {
    this.preinit();
  }

  ngAfterViewInit() {
  }
}
