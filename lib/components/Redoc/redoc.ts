'use strict';

import { provide, enableProdMode, ElementRef,
  ComponentRef, AfterViewInit } from '@angular/core';
import {enableProdMode as compilerProd} from '@angular/compiler/src/facade/lang';
import {enableProdMode as browserProd } from '@angular/platform-browser/src/facade/lang';
import {CompilerConfig} from '@angular/compiler';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { RedocComponent, BaseComponent } from '../base';

import detectScollParent from 'scrollparent';

import { ApiInfo } from '../ApiInfo/api-info';
import { ApiLogo } from '../ApiLogo/api-logo';
import { MethodsList } from '../MethodsList/methods-list';
import { SideMenu } from '../SideMenu/side-menu';

import { StickySidebar } from '../../shared/components/index';
import {SpecManager} from '../../utils/SpecManager';
import { OptionsService, RedocEventsService } from '../../services/index';
//import redocVersion from '../../version.js';

var dom = new BrowserDomAdapter();
var _modeLocked = false;

@RedocComponent({
  selector: 'redoc',
  providers: [
    SpecManager,
    BrowserDomAdapter,
    RedocEventsService
  ],
  templateUrl: './redoc.html',
  styleUrls: ['./redoc.css'],
  directives: [ ApiInfo, ApiLogo, MethodsList, SideMenu, StickySidebar ],
  detect: true,
  onPushOnly: false
})
export class Redoc extends BaseComponent implements AfterViewInit {
  static appRef: ComponentRef<any>;

  options: any;

  private element: any;

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

  static init(specUrl?, options?) {
    var optionsService = new OptionsService(dom);
    optionsService.options = options;
    optionsService.options.specUrl = optionsService.options.specUrl || specUrl;
    var providers = [
      provide(OptionsService, {useValue: optionsService}),
      provide(CompilerConfig, {useValue: new CompilerConfig({genDebugInfo: false, logBindingUpdate: false})})
    ];

    if (Redoc.appRef) {
      Redoc.destroy();
    }
    Redoc.showLoadingAnimation();
    return SpecManager.instance().load(specUrl)
    .then(() => {
      if (!_modeLocked && !optionsService.options.debugMode) {
        enableProdMode();
        compilerProd();
        browserProd();
        _modeLocked = true;
      }
      return bootstrap(Redoc, providers);
    })
    .then(appRef => {
      Redoc.hideLoadingAnimation();
      Redoc.appRef = appRef;
      console.log('ReDoc bootstrapped!');
    }, err => {
      console.log(err);
      Redoc.hideLoadingAnimation();
      Redoc.displayError(err);
    });
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

  static displayError(err) {
    console.log(err);
    let redocEl = dom.query('redoc');
    let heading = 'Oops... ReDoc failed to render this spec';
    let details = err.message;
    let erroHtml = `<div class="redoc-error">
      <h1>${heading}</h1>
      <div class='redoc-error-details'>${details}</div>`;
    redocEl.innerHTML = erroHtml;
  }

  // static get version() {
  //   return redocVersion;
  // }

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
      if (parent) parent.insertBefore(elClone, nextSibling);
    }
  }

  constructor(schemaMgr: SpecManager, optionsMgr:OptionsService, elementRef:ElementRef,
    public events:RedocEventsService) {
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
      this.events.bootstrapped.next({});
    });
  }
}
