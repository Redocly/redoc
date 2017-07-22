#!/usr/bin/env node
'use strict';
require('shelljs/global');

set('-e');
set('-v');


cat([
  'lib/components/Redoc/redoc-initial-styles.css',
  'node_modules/perfect-scrollbar/dist/css/perfect-scrollbar.css',
  'node_modules/dropkickjs/build/css/dropkick.css',
  'node_modules/prismjs/themes/prism-dark.css',
  'node_modules/hint.css/hint.base.css'
]).to('dist/redoc.css')
