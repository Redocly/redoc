'use strict';

import {Redoc} from './components/index';
import {enableProdMode} from 'angular2/core';

export var init = Redoc.init;

window.Redoc = Redoc;
enableProdMode();
Redoc.autoInit();
