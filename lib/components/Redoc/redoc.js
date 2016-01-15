'use strict';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';

import ApiInfo from '../ApiInfo/api-info';
import ApiLogo from '../ApiLogo/api-logo';
import MethodsList from '../MethodsList/methods-list';
import SideMenu from '../SideMenu/side-menu';
import StickySidebar from '../../common/components/StickySidebar/sticky-sidebar';
import OptionsManager from '../../options';
import {redocEvents} from '../../events';

import {ChangeDetectionStrategy} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {BrowserDomAdapter, bootstrap} from 'angular2/platform/browser';
import detectScollParent from 'scrollparent';

import {isFunction} from 'angular2/src/facade/lang';

let optionNames = new Set(['scrollYOffset']);

@RedocComponent({
  selector: 'redoc',
  providers: [SchemaManager, BrowserDomAdapter, OptionsManager],
  templateUrl: './lib/components/Redoc/redoc.html',
  styleUrls: ['./lib/components/Redoc/redoc.css'],
  directives: [ApiInfo, ApiLogo, MethodsList, SideMenu, StickySidebar],
  changeDetection: ChangeDetectionStrategy.Default
})
export default class Redoc extends BaseComponent {
  constructor(schemaMgr, optionsMgr, elementRef, dom) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;

    this.dom = dom;
    let el = this.element;

    //parse options (top level component doesn't support inputs)
    this.scrollParent = detectScollParent(el);
    this.parseOptions();
    this.options = Object.assign({}, optionsMgr.options, this.options);
    this.normalizeOptions();
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
  }

  normalizeOptions() {
    // modify scrollYOffset to always be a function
    if (!isFunction(this.options.scrollYOffset)) {
      if (isFinite(this.options.scrollYOffset)) {
        // if number specified create function that returns this value
        let numberOffset = parseFloat(this.options.scrollYOffset);
        this.options.scrollYOffset = () => numberOffset;
      } else {
        // if selector or node function that returns bottom offset of this node
        let el = this.options.scrollYOffset;
        if (!(el instanceof Node)) {
          el = this.dom.query(el);
        }
        if (!el) {
          this.options.scrollYOffset = () => 0;
        } else {
          this.options.scrollYOffset = () => el.offsetTop + el.offsetHeight;
        }
      }
    }
  }

  static init(schemaUrl, options) {
    if (Redoc.appRef) {
      Redoc.dispose();
    }
    return SchemaManager.instance().load(schemaUrl)
    .then(() => {
      (new OptionsManager()).options = options;
      return bootstrap(Redoc);
    })
    .then(
      (appRef) => {
        Redoc.appRef = appRef;
        redocEvents.bootstrapped.next();
        console.log('ReDoc bootstrapped!');
        //resolve();
      },
      error => {
        console.log(error);
        throw error;
      }
    );
  }

  static dispose() {
    let dom = new BrowserDomAdapter();
    let el = dom.query('redoc');
    let parent = el.parentElement;
    let nextSibling = el.nextElementSibling;

    Redoc.appRef && Redoc.appRef.dispose();
    Redoc.appRef = null;

    // Redoc dispose removes host element, so need to restore it
    el = dom.createElement('redoc');
    el.innerText = 'Loading...';
    parent.insertBefore(el, nextSibling);
  }
}
Redoc.parameters = Redoc.parameters.concat([[OptionsManager], [ElementRef], [BrowserDomAdapter]]);

// TODO
// this doesn't work in side-menu.js because of some circular references issue
SideMenu.parameters = SideMenu.parameters.concat([[Redoc]]);
