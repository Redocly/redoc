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


//copied from angular/modules/angular2/src/testing/e2e_util.ts
function verifyNoBrowserErrors() {
  // Bug in ChromeDriver: Need to execute at least one command
  // so that the browser logs can be read out!
  browser.executeScript('1+1');
  browser.manage().logs().get('browser').then(function(browserLog) {
    var filteredLog = browserLog.filter(function(logEntry) {
      if (logEntry.level.value >= browser.webdriver.logging.Level.INFO.value) {
        //console.log('>> ' + logEntry.message);
      }
      return logEntry.level.value > browser.webdriver.logging.Level.WARNING.value;
    });
    expect(filteredLog.length).toEqual(0);
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
