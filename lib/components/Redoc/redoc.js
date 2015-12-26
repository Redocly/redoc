'use strict';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';

import ApiInfo from '../ApiInfo/api-info';
import ApiLogo from '../ApiLogo/api-logo';
import MethodsList from '../MethodsList/methods-list';
import SideMenu from '../SideMenu/side-menu';
import StickySidebar from '../../common/components/StickySidebar/sticky-sidebar';

import {ChangeDetectionStrategy} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';
import detectScollParent from 'scrollparent';


@RedocComponent({
  selector: 'redoc',
  providers: [SchemaManager, BrowserDomAdapter],
  templateUrl: './lib/components/Redoc/redoc.html',
  styleUrls: ['./lib/components/Redoc/redoc.css'],
  directives: [ApiInfo, ApiLogo, MethodsList, SideMenu, StickySidebar],
  changeDetection: ChangeDetectionStrategy.Default
})
export default class Redoc extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;

    let DOM = new BrowserDomAdapter();
    let el = this.element;
    this.options = {};

    //parse options (top level component doesn't support inputs)
    this.options.scrollParent = detectScollParent(el);
    this.options.scrollOffsetTop = parseInt(DOM.getAttribute(el, 'scroll-y-offset')) || 0;
  }
}
Redoc.parameters = Redoc.parameters.concat([[ElementRef]]);

// this doesn't work in side-menu.js because of some circular references issue
SideMenu.parameters = SideMenu.parameters.concat([[Redoc]]);
