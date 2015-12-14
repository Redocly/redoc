'use strict';

import {EventEmitter} from 'angular2/core';

var bootsrEmmiter = new EventEmitter();
export var redocEvents = {
  bootstrapped: bootsrEmmiter
};
