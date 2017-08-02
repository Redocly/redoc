#!/usr/bin/env node
'use strict';

require('shelljs/global');
set('-e');

function isPR() {
  return process.env.TRAVIS_PULL_REQUEST && process.env.TRAVIS_PULL_REQUEST !== 'false';
}

function isCI() {
  return !!process.env.CI;
}

if (process.env.JOB === 'e2e-guru') {
  if (isPR()) {
    console.log('Skiping E2E tests on PR');
    return;
  }
  exec('npm run e2e');
} else {
  exec('npm run unit');
  if (isPR()) {
    console.log('Skiping E2E tests on PR');
    return;
  }
  if (!isCI()) {
    console.log('Skiping E2E tests locally. Use `npm run e2e` to run');
    return;
  }
  console.log('Starting Basic E2E');
  exec('npm run e2e');
}
