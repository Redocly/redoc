'use strict';

import {bootstrap} from 'angular2/angular2';
import {Redoc} from './components/index';
import SchemaManager from './utils/SchemaManager';

export * from  './components/index';

export function init(schemaUrl) {
  SchemaManager.instance().load(schemaUrl)
  .then(() => bootstrap(Redoc))
  .then(
    () => console.log('ReDoc bootstrapped!'),
    error => console.log(error)
  );
}

window.Redoc = Redoc;
