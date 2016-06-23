'use strict';
import 'dropkickjs/build/css/dropkick.css!css';
import 'prismjs/themes/prism-dark.css!css';
import 'hint.css/hint.base.css!css';
import './components/Redoc/redoc-initial-styles.css!css';
import { redocVersion } from './version.js';

import { Redoc } from './components/index';

Redoc.version = redocVersion;

export var init = Redoc.init;

window['Redoc'] = Redoc;
Redoc.autoInit();
