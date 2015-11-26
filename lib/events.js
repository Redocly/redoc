'use strict';

import {EventEmitter} from 'angular2/angular2';

var bootsrEmmiter = new EventEmitter();
export var redocEvents = {
  bootstrapped: bootsrEmmiter
};
