'use strict';

import {statusCodeType, isJsonLike, getJsonLike } from '../../lib/utils/helpers';

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

  describe('isJsonLike', () => {
    it('Should return true for a string that contains `json`', () => {
      isJsonLike('application/json').should.be.equal(true);
    });
    it('Should return false for a string that does not contain `json`', () => {
      isJsonLike('application/xml').should.be.equal(false);
    });
  });

  describe('getJsonLike', () => {
    it('Should return a value when a JSON-like key exists', () => {
      const examples = {
        "application/vnd.api+json": {
          "message": "Hello World"
        },
        "application/xml": "<message>Hello World</message>"
      };

      (getJsonLike(examples).message).should.be.equal("Hello World");
    });

    it('Should return undefined when no JSON-like key exists', () => {
      const examples = {
        "application/xml": "<message>Hello World</message>"
      };

      getJsonLike(examples).should.be.equal(false);
    });
  })
});
