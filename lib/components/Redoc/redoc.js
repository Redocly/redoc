'use strict';

import {ChangeDetectionStrategy, provide} from 'angular2/core';
import {ElementRef} from 'angular2/core';
import {BrowserDomAdapter, bootstrap} from 'angular2/platform/browser';
import detectScollParent from 'scrollparent';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';

import ApiInfo from '../ApiInfo/api-info';
import ApiLogo from '../ApiLogo/api-logo';
import MethodsList from '../MethodsList/methods-list';
import SideMenu from '../SideMenu/side-menu';
import StickySidebar from '../../common/components/StickySidebar/sticky-sidebar';
import OptionsManager from '../../options';
import {redocEvents} from '../../events';

import './redoc-loading-styles.css!css';

let dom = new BrowserDomAdapter();

@RedocComponent({
  selector: 'redoc',
  providers: [
    SchemaManager,
    BrowserDomAdapter,
    provide('OPTION_NAMES', {useValue: new Set(['scrollYOffset', 'disableLazySchemas'])}),
    provide(OptionsManager, {useClass: OptionsManager})
  ],
  templateUrl: './lib/components/Redoc/redoc.html',
  styleUrls: ['./lib/components/Redoc/redoc.css'],
  directives: [ApiInfo, ApiLogo, MethodsList, SideMenu, StickySidebar],
  changeDetection: ChangeDetectionStrategy.Default
})
@Reflect.metadata('parameters', [
  [SchemaManager], [OptionsManager], [ElementRef]])
export default class Redoc extends BaseComponent {
  constructor(schemaMgr, optionsMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
    //parse options (top level component doesn't support inputs)
    optionsMgr.parseOptions( this.element );
    optionsMgr.options.$scrollParent = detectScollParent( this.element );
    this.options = optionsMgr.options;
  }

  static showLoadingAnimation() {
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
        // setTimeout to allow cached elements to init
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
    let redocEl = dom.query('redoc');
    if (!redocEl) return;
    if (dom.hasAttribute(redocEl, specUrlAttributeName)) {
      let url = dom.getAttribute(redocEl, specUrlAttributeName);
      Redoc.init(url);
    }
  }

  static dispose() {
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
