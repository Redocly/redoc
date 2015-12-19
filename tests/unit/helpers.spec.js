'use strict';

import {statusCodeType} from 'lib/utils/helpers';
describe('Utils', () => {
  describe('statusCodeType', () => {
    it('Should return info for status codes within 100 and 200', ()=> {
      statusCodeType(100).should.be.equal('info');
      statusCodeType(150).should.be.equal('info');
      statusCodeType(199).should.be.equal('info');
    });

    it('Should return success for status codes within 200 and 300', ()=> {
      statusCodeType(200).should.be.equal('success');
      statusCodeType(250).should.be.equal('success');
      statusCodeType(299).should.be.equal('success');
    });
    it('Should return redirect for status codes within 300 and 400', ()=> {
      statusCodeType(300).should.be.equal('redirect');
      statusCodeType(350).should.be.equal('redirect');
      statusCodeType(399).should.be.equal('redirect');
    });
    it('Should return error for status codes above 400', ()=> {
      statusCodeType(400).should.be.equal('error');
      statusCodeType(500).should.be.equal('error');
      statusCodeType(599).should.be.equal('error');
    });

    it('Should throw for incorrect HTTP code', ()=> {
      (() => statusCodeType(99)).should.throw('invalid HTTP code');
      (() => statusCodeType(600)).should.throw('invalid HTTP code');
    });
  });
});
