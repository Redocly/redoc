'use strict';

import 'zone.js';
import 'reflect-metadata';
import { bootstrap } from 'angular2/angular2';
import { RedocTest } from './RedocTest/redoc-test';

export * from  './RedocTest/redoc-test';

export function init() {
  bootstrap(RedocTest).then(
    () => console.log('ReDoc bootstrapped!'),
    error => console.log(error)
  );
}
