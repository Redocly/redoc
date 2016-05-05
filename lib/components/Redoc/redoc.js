'use strict';

import {provide, enableProdMode} from '@angular/core';
import {ElementRef} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';

import detectScollParent from 'scrollparent';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';

import {
  ApiInfo,
  ApiLogo,
  MethodsList,
  SideMenu
} from '../index';
import { StickySidebar } from '../../shared/components/index';

import OptionsManager from '../../options';
import { RedocEventsService } from '../../services/index';

import './redoc-loading-styles.css!css';

var dom = new BrowserDomAdapter();
var _modeLocked = false;

@RedocComponent({
  selector: 'redoc',
  providers: [
    SchemaManager,
    BrowserDomAdapter,
    RedocEventsService
  ],
  templateUrl: './lib/components/Redoc/redoc.html',
  styleUrls: ['./lib/components/Redoc/redoc.css'],
  directives: [ApiInfo, ApiLogo, MethodsList, SideMenu, StickySidebar]
})
@Reflect.metadata('parameters', [
  [SchemaManager], [OptionsManager], [ElementRef], [RedocEventsService]])
export class Redoc extends BaseComponent {
  constructor(schemaMgr, optionsMgr, elementRef, events) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
    //parse options (top level component doesn't support inputs)
    optionsMgr.parseOptions( this.element );
    optionsMgr.options.$scrollParent = detectScollParent( this.element );
    this.options = optionsMgr.options;
    this.events = events;
  }

  ngAfterViewInit() {
    setTimeout( () => {
      this.events.bootstrapped.next();
    });
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

  static init(specUrl, options) {
    var optionsMgr = new OptionsManager();
    optionsMgr.options = options;
    optionsMgr.options.specUrl = optionsMgr.options.specUrl || specUrl;
    var providers = [
      provide(OptionsManager, {useValue: optionsMgr})
    ];

    if (Redoc.appRef) {
      Redoc.destroy();
    }
    Redoc.showLoadingAnimation();
    return SchemaManager.instance().load(specUrl)
    .then(() => {
      if (!_modeLocked && !optionsMgr.options.debugMode) {
        enableProdMode();
        _modeLocked = true;
      }
      return bootstrap(Redoc, providers);
    })
    .then(
      (appRef) => {
        Redoc.hideLoadingAnimation();
        Redoc.appRef = appRef;
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

  static destroy() {
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
      Redoc.appRef.destroy();
      Redoc.appRef = null;

      // Redoc destroy removes host element, so need to restore it
      elClone.innerHTML = 'Loading...';
      parent && parent.insertBefore(elClone, nextSibling);
    }
  }
}
