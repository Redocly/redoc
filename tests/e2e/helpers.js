'use strict';

var https = require('https');

function loadJson(url) {
  let promise = new Promise((resolve, reject) => {
    https.get(url, function(res){
      var body = '';

      res.on('data', function(chunk){
        body += chunk;
      });

      res.on('end', function(){
        let resp = JSON.parse(body);
        resolve(resp);
      });
    }).on('error', function(e){
      reject(e);
    });
  });
  return promise;
}

const LogLevel = {
  INFO: 800,
  WARNING: 900
};

const MAX_ERROR_MESSAGE_SYMBOLS = 128;
//copied from angular/modules/angular2/src/testing/e2e_util.ts
function verifyNoBrowserErrors() {
  // IE doesn't support logs method
  if (browser.isIE) {
    let err = browser.executeScript('return window.redocError');
    expect(err).toBeNull();
    return;
  }

  // Bug in ChromeDriver: Need to execute at least one command
  // so that the browser logs can be read out!
  browser.executeScript('1+1');
  browser.manage().logs().get('browser').then(function(browserLog) {
    let filteredLog = browserLog.filter((logEntry) => {
      let message = logEntry.message;

      // skip browser-sync errors
      if (message.indexOf('browser-sync') > -1) return false;
      // skip firefox-specific warning
      if (message.indexOf('mutating the [[Prototype]]') > -1) return false;

      if (logEntry.level.value >= LogLevel.INFO) {
        if (message.length > MAX_ERROR_MESSAGE_SYMBOLS) {
          message = message.substr(0, MAX_ERROR_MESSAGE_SYMBOLS) + '...';
        }
        console.log('>> ' + message);
      }

      return logEntry.level.value > LogLevel.WARNING;
    });
    expect(filteredLog.length).toEqual(0, `Found ${filteredLog.length} browser errors`);
  });
}

function scrollToEl(selector) {
  let script = `
    document.querySelector('${selector}').scrollIntoView(true);
    window.scrollBy(0, 10);
  `;

  return browser.driver.executeScript(script);
}

function fixFFTest(done) {
  // firefox issue. the first try to access something from webpage fails
  // but the second works fine. So skipping first error
  $('body').isPresent().then(()=> {
    done();
  }, () => {
    //error skipped
    done();
  })
}

/* picks each n-th property from object */
function eachNth(obj, n) {
  let res = {};
  Object.keys(obj).forEach((k, idx) => {
    if (idx % n === 0) {
      res[k] = obj[k];
    }
  });
  return res;
}

module.exports = {
  loadJson: loadJson,
  verifyNoBrowserErrors: verifyNoBrowserErrors,
  scrollToEl: scrollToEl,
  fixFFTest: fixFFTest,
  eachNth: eachNth
}
