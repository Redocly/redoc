'use strict';
const loadJson = require('./tests/e2e/helpers').loadJson;
const travis = process.env.TRAVIS;

let config = {
  specs: ['./tests/e2e/**/*.e2e.js'],
  baseUrl: 'http://localhost:3000',
  framework: 'jasmine2',
  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
     // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displaySpecDuration: true}));
    // load APIs.guru list
    return loadJson('https://api.apis.guru/v2/list.json').then((list) => {
      global.apisGuruList = list;
      return browser.getCapabilities().then(function (caps) {
        browser.isIE = caps.get('browserName') === 'internet explorer';
      });
    });
  },
  //directConnect: true,
  useAllAngular2AppRoots: true,
  allScriptsTimeout: 180000,
  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    defaultTimeoutInterval: 180000,
    print: function() {}
  },
  multiCapabilities: [
    { browserName: 'chrome' }
    // { browserName: 'firefox' }
  ]
};

if (travis) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.sauceSeleniumAddres = 'localhost:4445/wd/hub';
  config.multiCapabilities = [{
    browserName: 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'Redoc Chrome/Linux build ' + process.env.TRAVIS_BUILD_NUMBER
  },{
    browserName: 'safari',
    platform: 'OS X 10.11',
    version: '9.0',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'Redoc Safari Latest/OSX build ' + process.env.TRAVIS_BUILD_NUMBER,
    idleTimeout: 180,
    maxDuration: 1800*2
  },{
    browserName: 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'Redoc Firefox Latest/Win build ' + process.env.TRAVIS_BUILD_NUMBER,
    maxDuration: 1800*2
  },{
    browserName: 'internet explorer',
    version: '11.0',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    build: process.env.TRAVIS_BUILD_NUMBER,
    name: 'Redoc IE11/Win build ' + process.env.TRAVIS_BUILD_NUMBER,
    maxDuration: 1800*2
  }];
} else {
  config.directConnect = true;
}

exports.config = config;
