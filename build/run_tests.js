#!/usr/bin/env node
'use strict';

require('shelljs/global');
set('-e');

if (process.env.JOB === 'e2e-guru') {
  exec('npm run e2e');
} else {
  exec('npm run unit');
  console.log('Starting Basic E2E');
  exec('npm run e2e');
}
