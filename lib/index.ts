'use strict';
import './components/Redoc/redoc-initial-styles.css';

import { enableProdMode } from '@angular/core';
import { Redoc } from './components/index';
import { SpecManager } from './utils/SpecManager';
import { BrowserDomAdapter as DOM } from './utils/browser-adapter';
import { disableDebugTools } from '@angular/platform-browser';
import { bootstrapRedoc } from './bootstrap';

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

  Redoc._preOptions = options;
  options.specUrl = options.specUrl || specUrl;

  Redoc.showLoadingAnimation();
  return SpecManager.instance().load(specUrl)
  .then(() => {
    return bootstrapRedoc();
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
