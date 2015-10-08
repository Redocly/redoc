'use strict';

import 'reflect-metadata';
import { bootstrap } from 'angular2/angular2';
import { Redoc } from './components/Redoc/redoc';
import { SchemaManager} from './utils/SchemaManager';

export * from  './components/index';

export function init(schemaUrl) {
  SchemaManager.instance().load(schemaUrl).then(
    () => {
      return bootstrap(Redoc);
    }
  ).then(
    () => console.log('ReDoc bootstrapped!'),
    error => console.log(error)
  );
}
