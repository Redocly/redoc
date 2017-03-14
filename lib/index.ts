'use strict';
import './components/Redoc/redoc-initial-styles.css';

import { enableProdMode } from '@angular/core';
import { Redoc } from './components/index';
import { BrowserDomAdapter as DOM } from './utils/browser-adapter';
import { disableDebugTools } from '@angular/platform-browser';
import { isString } from './utils/helpers';

var bootstrapRedoc;
if (AOT) {
  bootstrapRedoc = require('./bootstrap').bootstrapRedoc;
} else {
  bootstrapRedoc = require('./bootstrap.dev').bootstrapRedoc;
}

if (IS_PRODUCTION) {
  disableDebugTools();
  enableProdMode();
}

export const version = LIB_VERSION;

var moduleRef;
export function init(specUrlOrSpec:string|any, options:any = {}) {
  if (moduleRef) {
    destroy();
  }

  Redoc._preOptions = options;
  options.specUrl = options.specUrl || (isString(specUrlOrSpec) ? specUrlOrSpec : '');
  if (!isString(specUrlOrSpec)) {
    options.spec = specUrlOrSpec;
  }
  return bootstrapRedoc()
  .then(appRef => {
    moduleRef = appRef;
    console.log('ReDoc initialized!');
  }).catch(err => {
    throw err;
  });
};

export function destroy() {
  moduleRef.destroy();
  moduleRef = null;
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
