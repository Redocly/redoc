'use strict';
import {init} from 'lib/index';

describe('Redoc init', () => {
  it('should return promise', () => {
    let res = init();
    res.should.be.instanceof(Promise);
  });

  it('should reject promise for not specifed url', (done) => {
    let res = init();
    res.then(() => { done.fail('Should not been called'); }, () => {
      done();
    });
  });

  //skip because of PhantomJS crashes on this testcase
  xit('should init redoc', (done) => {
    var node = document.createElement('redoc');
    document.body.appendChild(node);
    let res = init('/tests/schemas/extended-petstore.json');
    res.then(() => { done(); }, () => {
      done.fail('Error handler should not been called');
    });
  });
});
