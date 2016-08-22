'use strict';
import './components/Redoc/redoc-initial-styles.css!css';
import 'dropkickjs/build/css/dropkick.css!css';
import 'prismjs/themes/prism-dark.css!css';
import 'hint.css/hint.base.css!css';
//import { redocVersion } from './version.js';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { RedocModule } from './redoc.module';
import { Redoc } from './components/index';
//import { getOptions } from './redoc.module';
import { SpecManager } from './utils/SpecManager';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';

var dom = new BrowserDomAdapter();

//Redoc.version = redocVersion;
var moduleRef;
export function init(specUrl:string, options?) {
  // if (!optionsService.options.debugMode) {
  //   enableProdMode();
  // }
  //
  // if (moduleRef) {
  //   destroy();
  // }
  //
  // optionsService.options = options;
  // optionsService.options.specUrl = optionsService.options.specUrl || specUrl;

  Redoc.showLoadingAnimation();
  return SpecManager.instance().load(specUrl)
  .then(() => {
    return platformBrowserDynamic().bootstrapModule(RedocModule);
  })
  .then(appRef => {
    Redoc.hideLoadingAnimation();
    moduleRef = appRef;
    console.log('ReDoc initialized!');
  }).catch(err => {
    Redoc.hideLoadingAnimation();
    Redoc.displayError(err);
    throw err;
  });
};

export function destroy() {
  moduleRef.destroy();
};


function autoInit() {
  const specUrlAttributeName = 'spec-url';
  let redocEl = dom.query('redoc');
  if (!redocEl) return;
  if (dom.hasAttribute(redocEl, specUrlAttributeName)) {
    let url = dom.getAttribute(redocEl, specUrlAttributeName);
    init(url);
  }
};

autoInit();
