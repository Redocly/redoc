'use strict';

import {EventEmitter} from '@angular/core';

var bootsrEmmiter = new EventEmitter();
var langChanged = new EventEmitter();
export var redocEvents = {
  bootstrapped: bootsrEmmiter,
  samplesLanguageChanged: langChanged
};
