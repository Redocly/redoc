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
  // Bug in ChromeDriver: Need to execute at least one command
  // so that the browser logs can be read out!
  browser.executeScript('1+1');
  browser.manage().logs().get('browser').then(function(browserLog) {
    let filteredLog = browserLog.filter((logEntry) => {
      let message = logEntry.message;
      if (logEntry.level.value >= LogLevel.INFO) {
        if (message.length > MAX_ERROR_MESSAGE_SYMBOLS) {
          message = message.substr(0, MAX_ERROR_MESSAGE_SYMBOLS) + '...';
        }
        console.log('>> ' + message);
      }

      // skip browser-sync errors
      if (message.indexOf('browser-sync') > -1) return false;
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

module.exports = {
  loadJson: loadJson,
  verifyNoBrowserErrors: verifyNoBrowserErrors,
  scrollToEl: scrollToEl
}
