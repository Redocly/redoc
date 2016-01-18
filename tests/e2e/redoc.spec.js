'use strict';
const verifyNoBrowserErrors = require('./helpers').verifyNoBrowserErrors;
const scrollToEl = require('./helpers').scrollToEl;
const fixFFTest = require('./helpers').fixFFTest;

const URL = 'index.html';

function basicTests(swaggerUrl, title) {
  describe(`Basic suite for ${title}`, () => {
    let specUrl = URL;
    if (swaggerUrl) {
      specUrl += `?url=${encodeURIComponent(swaggerUrl)}`;
    }

    beforeEach((done) => {
      browser.get(specUrl);
      fixFFTest(done);
    });

    afterEach(() => {
      verifyNoBrowserErrors();
    });

    it('should init redoc without errors', () => {
      let $redoc = $('redoc');
      expect($redoc.isPresent()).toBe(true);
      let $methods = $$('method');
      expect($methods.count()).toBeGreaterThan(0);
    });
  });
}

basicTests(null, 'Extended Petstore');


describe('Scroll sync', () => {
  let specUrl = URL;
  
  beforeEach((done) => {
    browser.get(specUrl);
    fixFFTest(done);
  });

  it('should update active menu entries on page scroll', () => {
    scrollToEl('[tag="store"]').then(function() {
      expect($('.menu-cat-header.active').getText()).toBe('STORE');
    });
  });
});

describe('APIs.guru specs test', ()=> {

  // global.apisGuruList was loaded in onPrepare method of protractor config
  let apisGuruList = global.apisGuruList;

  // Remove certain APIs that are known to cause problems
  delete apisGuruList['motaword.com']; // invalid (see https://github.com/BigstickCarpet/swagger-parser/issues/26)
  delete apisGuruList['learnifier.com']; // allof object and no type
  delete apisGuruList['googleapis.com:mirror']; // bad urls in images
  delete apisGuruList['googleapis.com:discovery']; // non-string references

  for (let apiName of Object.keys(apisGuruList)) {
    let apiInfo = apisGuruList[apiName].versions[apisGuruList[apiName].preferred];
    let url = apiInfo.swaggerUrl;

    // temporary hack due to this issue: https://github.com/substack/https-browserify/issues/6
    url = url.replace('https://', 'http://');
    url = url.replace('apis-guru.github.io/', 'apis-guru.github.io:80/');
    basicTests(url, `${apiName}:${apiInfo.info.version}\n${url}`);
  }
});
