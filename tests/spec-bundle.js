'use strict';

Error.stackTraceLimit = Infinity;

require('core-js/es6');
require('core-js/es7/reflect');

// Typescript emit helpers polyfill
require('ts-helpers');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');
require('zone.js/dist/sync-test');
require('zone.js/dist/proxy');
require('zone.js/dist/jasmine-patch');

require('../lib/vendor');

var TestBed = require('@angular/core/testing').TestBed;
var BrowserDynamicTestingModule = require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule;
var platformBrowserDynamicTesting = require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting;
var services = require('../lib/services/index');
var SpecManager = require('../lib/utils/SpecManager').SpecManager;
var BrowserDomAdapter = require('@angular/platform-browser/src/browser/browser_adapter').BrowserDomAdapter;
var REDOC_PIPES = require('../lib/utils/pipes').REDOC_PIPES;
var REDOC_COMMON_DIRECTIVES = require('../lib/shared/components/index').REDOC_COMMON_DIRECTIVES;
var REDOC_DIRECTIVES = require('../lib/components/index').REDOC_DIRECTIVES;

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

beforeEach(function() {
  TestBed.configureTestingModule({
    providers: [
      BrowserDomAdapter,
      SpecManager,
      BrowserDomAdapter,
      services.RedocEventsService,
      services.ScrollService,
      services.Hash,
      services.MenuService,
      services.WarningsService,
      services.OptionsService
    ],
    declarations: [REDOC_PIPES, REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES]
  });
});


var testContext = require.context('..', true, /\.spec\.ts/);

/*
 * get all the files, for each file, call the context function
 * that will require( the file and load it up here. Context wil);
 * loop and require those spec files here
 */
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

// requires and returns all modules that match
var modules = requireAll(testContext);
