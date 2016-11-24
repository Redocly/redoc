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
var ErrorHandler = require('@angular/core').ErrorHandler;
var BrowserDynamicTestingModule = require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule;
var platformBrowserDynamicTesting = require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting;

var SpecManager = require('../lib/utils/spec-manager').SpecManager;
var services = require('../lib/services/index');
var REDOC_PIPES = require('../lib/utils/pipes').REDOC_PIPES;
var sharedComponents = require('../lib/shared/components/');
var REDOC_COMMON_DIRECTIVES = sharedComponents.REDOC_COMMON_DIRECTIVES;
var components = require('../lib/components/');
var REDOC_DIRECTIVES = components.REDOC_DIRECTIVES;

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

beforeEach(function() {
  TestBed.configureTestingModule({
    providers: [
      SpecManager,
      services.AppStateService,
      services.ScrollService,
      services.Hash,
      services.MenuService,
      services.WarningsService,
      services.OptionsService,
      services.ComponentParser,
      services.ContentProjector,
      { provide: sharedComponents.LazyTasksService, useClass: sharedComponents.LazyTasksServiceSync },
      { provide: ErrorHandler, useClass: services.CustomErrorHandler },
      { provide: services.COMPONENT_PARSER_ALLOWED, useValue: { 'security-definitions': components.SecurityDefinitions }}
    ],
    declarations: [REDOC_PIPES, REDOC_DIRECTIVES, REDOC_COMMON_DIRECTIVES]
  });
  TestBed.overrideModule(BrowserDynamicTestingModule, {
    set: {
      entryComponents: [ sharedComponents.DynamicNg2Wrapper, components.SecurityDefinitions ]
    },
  });
});

// afterEach(function() {
//     TestBed.resetTestingModule();
// });

// afterEach(function() {
//   TestBed.resetTestEnvironment();
// })


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
