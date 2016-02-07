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

import {isFunction, isString} from 'angular2/src/facade/lang';

let optionNames = new Set(['scrollYOffset', 'disableLazySchemas']);

let dom = new BrowserDomAdapter();

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
    optionsMgr.options = this.options;
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

    if (isString(this.options.disableLazySchemas)) this.options.disableLazySchemas = true;
  }

  static showLoadingAnimation() {
    if (!dom.query('#redoc-loading-style')) {
      let animStyle = dom.createStyleElement(`
        redoc.loading {
          position: relative;
          display: block;
          min-height:350px;
        }

        redoc.loading:before {
          content: "Loading...";
          font-size: 28px;
          text-align: center;
          padding-top: 40px;
          color: #3F5C9C;
          font-weight: bold;
          display: block;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          z-index: 9999;
          opacity: 1;
          transition: all 0.6s ease-out;
        }

        redoc.loading-remove:before {
          opacity: 0;
        }
      `);
      animStyle.id = 'redoc-loading-style';
      dom.appendChild(dom.defaultDoc().head, animStyle);
    }
    let elem = dom.query('redoc');
    dom.addClass(elem, 'loading');
  }

  static hideLoadingAnimation() {
    let redocEl = dom.query('redoc');
    dom.addClass(redocEl, 'loading-remove');
    setTimeout(() => {
      dom.removeClass(redocEl, 'loading-remove');
      dom.removeClass(redocEl, 'loading');
    }, 400);
  }

  static init(schemaUrl, options) {
    if (Redoc.appRef) {
      Redoc.dispose();
    }
    Redoc.showLoadingAnimation();
    return SchemaManager.instance().load(schemaUrl)
    .then(() => {
      (new OptionsManager()).options = options;
      return bootstrap(Redoc);
    })
    .then(
      (appRef) => {
        Redoc.hideLoadingAnimation();
        Redoc.appRef = appRef;
        setTimeout(() => redocEvents.bootstrapped.next());
        console.log('ReDoc bootstrapped!');
      },
      error => {
        console.log(error);
        throw error;
      }
    );
  }

  static autoInit() {
    const specUrlAttributeName = 'spec-url';
    let dom = new BrowserDomAdapter();
    let redocEl = dom.query('redoc');
    if (!redocEl) return;
    if (dom.hasAttribute(redocEl, specUrlAttributeName)) {
      let url = dom.getAttribute(redocEl, specUrlAttributeName);
      Redoc.init(url);
    }
  }

  static dispose() {
    let dom = new BrowserDomAdapter();
    let el = dom.query('redoc');
    let elClone;
    let parent;
    let nextSibling;
    if (el) {
      parent = el.parentElement;
      nextSibling = el.nextElementSibling;
    }

    elClone = el.cloneNode(false);

    if (Redoc.appRef) {
      Redoc.appRef.dispose();
      Redoc.appRef = null;

      // Redoc dispose removes host element, so need to restore it
      elClone.innerHTML = 'Loading...';
      parent && parent.insertBefore(elClone, nextSibling);
    }
  }
}
Redoc.parameters = Redoc.parameters.concat([[OptionsManager], [ElementRef], [BrowserDomAdapter]]);
