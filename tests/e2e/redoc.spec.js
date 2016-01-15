'use strict';
const verifyNoBrowserErrors = require('./helpers').verifyNoBrowserErrors;
const scrollToEl = require('./helpers').scrollToEl;

const URL = 'index.html';

function basicTests(swaggerUrl, title) {
  describe(`Basic suite for ${title}`, () => {
    let specUrl = URL;
    if (swaggerUrl) {
      specUrl += `?url=${encodeURIComponent(swaggerUrl)}`;
    }

    afterEach(() => {
      verifyNoBrowserErrors();
    });

    it('should exist redoc element', () => {
      browser.get(specUrl);
      let $redoc = $('redoc');
      expect($redoc.isPresent()).toBe(true);
      let $methods = $$('method');
      expect($methods.count()).toBeGreaterThan(0);
    });
  });
}

basicTests();


describe('Scroll sync', () => {
  it('should update active menu entries on page scroll', () => {
    browser.get(URL);
    scrollToEl('[tag="store"]').then(function() {
      expect($('.menu-cat-header.active').getText()).toBe('STORE');
    });
  });
});

describe('APIs.guru specs test', ()=> {

  // global.apisGuruList was loaded in onPrepare method of protractor config
  let apisGuruList = global.apisGuruList;
  for (let apiName of Object.keys(apisGuruList)) {
    let apiInfo = apisGuruList[apiName].versions[apisGuruList[apiName].preferred];
    let url = apiInfo.swaggerUrl;

    // temporary hack due to this issue: https://github.com/substack/https-browserify/issues/6
    url = url.replace('https://', 'http://');
    url = url.replace('apis-guru.github.io/', 'apis-guru.github.io:80/');
    basicTests(url, `${apiName} ${apiInfo.version}`);
  }
});
