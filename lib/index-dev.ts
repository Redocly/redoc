'use strict';
import './components/Redoc/redoc-initial-styles.css';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { RedocModule } from './redoc.module';
import { Redoc } from './components/index';
import { SpecManager } from './utils/SpecManager';
import { BrowserDomAdapter as DOM } from './utils/browser-adapter';
import { disableDebugTools } from '@angular/platform-browser';

export const version = LIB_VERSION;

var moduleRef;
export function init(specUrl:string, options?) {
  if (IS_PRODUCTION) {
    disableDebugTools();
    enableProdMode();
  }

  if (moduleRef) {
    destroy();
  }
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
  let redocEl = DOM.query('redoc');
  if (!redocEl) return;
  if (DOM.hasAttribute(redocEl, specUrlAttributeName)) {
    let url = DOM.getAttribute(redocEl, specUrlAttributeName);
    init(url);
  }
};

autoInit();
