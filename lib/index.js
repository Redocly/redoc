'use strict';

import {bootstrap} from 'angular2/platform/browser';
import {Redoc} from './components/index';
import SchemaManager from './utils/SchemaManager';
import {redocEvents} from './events';
import OptionsManager from './options';
export * from  './components/index';

export function init(schemaUrl, options) {
  var promise = new Promise(function(resolve, reject) {

    SchemaManager.instance().load(schemaUrl)
    .then(() => {
      (new OptionsManager()).options = options;
      return bootstrap(Redoc);
    })
    .then(
      () => {
        redocEvents.bootstrapped.next();
        console.log('ReDoc bootstrapped!');
        resolve();
      },
      error => {
        console.log(error);
        reject();
      }
    );
  });
  return promise;
}

window.Redoc = Redoc;
