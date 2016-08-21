'use strict';
import './components/Redoc/redoc-initial-styles.css!css';
import 'dropkickjs/build/css/dropkick.css!css';
import 'prismjs/themes/prism-dark.css!css';
import 'hint.css/hint.base.css!css';
//import { redocVersion } from './version.js';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { Redoc } from './components/index';
import { optionsService } from './redoc.module.ts';

//Redoc.version = redocVersion;
var moduleRef;
export var init = function(specUrl:string, options) {
  if (!optionsService.options.debugMode) {
    enableProdMode();
  }

  if (moduleRef) {
    destrot();
  }

  optionsService.options = options;
  optionsService.options.specUrl = optionsService.options.specUrl || specUrl;

  Redoc.showLoadingAnimation();
  return SpecManager.instance().load(specUrl)
  .then(() => {

    return platformBrowserDynamic().bootstrapModule(MyAppModule);
  })
  .then(appRef => {
    Redoc.hideLoadingAnimation();
    Redoc.appRef = appRef;
    console.log('ReDoc bootstrapped!');
  }).catch(err => {
    Redoc.hideLoadingAnimation();
    Redoc.displayError(err);
    throw err;
  });
}

export var destroy = function() {
  //t
};


export var autoInit = function() {
  // tes
};

autoInit()
