'use strict';

import 'reflect-metadata';
import { bootstrap } from 'angular2/angular2';
import { Redoc, SideMenu } from './components/index';
import { SchemaManager} from './utils/SchemaManager';

export * from  './components/index';

export function init(schemaUrl) {
  SchemaManager.instance().load(schemaUrl).then(
    () => {
      return bootstrap(Redoc);
    }
  ).then(() => bootstrap(SideMenu))
  .then(
    () => console.log('ReDoc bootstrapped!'),
    error => console.log(error)
  );
}

window.Redoc = Redoc;
