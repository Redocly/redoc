'use strict';
const loadJson = require('./tests/e2e/helpers').loadJson;
const travis = process.env.TRAVIS;

let config = {
  specs: ['./tests/e2e/**/*.js'],
  baseUrl: 'http://localhost:3000',
  framework: 'jasmine2',
  onPrepare: function() {
    var SpecReporter = require('jasmine-spec-reporter');
     // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displaySpecDuration: true}));
    // load APIs.guru list
    return loadJson('https://apis-guru.github.io/api-models/api/v1/list.json').then((list) => {
      global.apisGuruList = list;
    });
  },
  //directConnect: true,
  useAllAngular2AppRoots: true,
  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  multiCapabilities: [{
    browserName: 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  }]
};

if (travis) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.sauceSeleniumAddres = 'localhost:4445/wd/hub';
} else {
  config.directConnect = true;
}

exports.config = config;
