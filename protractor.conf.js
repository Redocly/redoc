'use strict';

const loadJson = require('./tests/e2e/helpers').loadJson;
exports.config = {
  specs: ['./tests/e2e/**/*.js'],
  capabilities: {
    browserName: 'chrome'
  },
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
  directConnect: true,
  useAllAngular2AppRoots: true,
  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    print: function() {}
  }
};
