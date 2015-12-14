'use strict';

import {bootstrap} from 'angular2/platform/browser';
import {Redoc} from './components/index';
import SchemaManager from './utils/SchemaManager';
import {redocEvents} from './events';
export * from  './components/index';



export function init(schemaUrl) {
  SchemaManager.instance().load(schemaUrl)
  .then(() => bootstrap(Redoc))
  .then(
    () => {
      redocEvents.bootstrapped.next();
      console.log('ReDoc bootstrapped!');
    },
    error => console.log(error)
  );
}

window.Redoc = Redoc;
