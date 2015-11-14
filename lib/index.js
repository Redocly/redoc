'use strict';

import {bootstrap} from 'angular2/angular2';
import {Redoc, SideMenu} from './components/index';
import SchemaManager from './utils/SchemaManager';

export * from  './components/index';

export function init(schemaUrl) {
  SchemaManager.instance().load(schemaUrl).then(
    () => {
      return bootstrap(SideMenu);
    }
  ).then(() => bootstrap(Redoc))
  .then(
    () => console.log('ReDoc bootstrapped!'),
    error => console.log(error)
  );
}

window.Redoc = Redoc;
