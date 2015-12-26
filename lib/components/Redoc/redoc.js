'use strict';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';

import ApiInfo from '../ApiInfo/api-info';
import ApiLogo from '../ApiLogo/api-logo';
import MethodsList from '../MethodsList/methods-list';
import SideMenu from '../SideMenu/side-menu';
import StickySidebar from '../../common/components/StickySidebar/sticky-sidebar';
import {options as defaultOptions} from '../../index';

import {ChangeDetectionStrategy} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';
import detectScollParent from 'scrollparent';

let optionNames = new Set(['scrollYOffset']);

@RedocComponent({
  selector: 'redoc',
  providers: [SchemaManager, BrowserDomAdapter],
  templateUrl: './lib/components/Redoc/redoc.html',
  styleUrls: ['./lib/components/Redoc/redoc.css'],
  directives: [ApiInfo, ApiLogo, MethodsList, SideMenu, StickySidebar],
  changeDetection: ChangeDetectionStrategy.Default
})
export default class Redoc extends BaseComponent {
  constructor(schemaMgr, elementRef, dom) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;

    this.dom = dom;
    let el = this.element;

    //parse options (top level component doesn't support inputs)
    this.scrollParent = detectScollParent(el);
    this.parseOptions();
    this.options = Object.assign({}, defaultOptions, this.options);
  }

  parseOptions() {
    let attributesMap = this.dom.attributeMap(this.element);
    this.options = {};
    Array.from(attributesMap.keys())
      //camelCasify
      .map(k => ({
        attrName: k,
        name: k.replace(/-(.)/g,  (m, $1) => $1.toUpperCase())
        })
      )
      .filter(option => optionNames.has(option.name))
      .forEach(option => {
        this.options[option.name] = attributesMap.get(option.attrName);
      });

    // post-process options
    this.options.scrollYOffset = parseInt(this.options.scrollYOffset);
  }
}
Redoc.parameters = Redoc.parameters.concat([[ElementRef], [BrowserDomAdapter]]);

// this doesn't work in side-menu.js because of some circular references issue
SideMenu.parameters = SideMenu.parameters.concat([[Redoc]]);
