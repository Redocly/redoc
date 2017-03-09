'use strict';

import { SpecManager } from '../../lib/utils/spec-manager';
import * as xExtendedDefs from './x-extended-defs.json';

describe('Utils', () => {
  describe('Schema manager', () => {
    let specMgr: SpecManager;

    beforeEach(() => {
      specMgr = new SpecManager();
    });

    it('load should return a promise', ()=> {
      specMgr.load('/tests/schemas/extended-petstore.yml').should.be.instanceof(Promise);
    });

    it('load should reject promise for invalid url', (done)=> {
      specMgr.load('/nonexisting/schema.json').then(() => {
        throw new Error('Success handler should not be called');
      }, () => {
        done();
      });
    });

    it('load should resolve promise for valid url', (done)=> {
      specMgr.load('/tests/schemas/extended-petstore.yml').then(() => {
        done();
      }, () => {
        throw new Error('Error handler should not be called');
      });
    });

    describe('Schema manager basic functionality', ()=> {
      beforeEach(function (done) {
        specMgr.load('/tests/schemas/extended-petstore.yml').then(done, done.fail);
      });

      it('should contain non-empty schema', ()=> {
        specMgr.schema.should.be.an.Object();
        specMgr.schema.should.be.not.empty();
      });

      it('should correctly init api url', ()=> {
        specMgr.apiUrl.should.be.equal('http://petstore.swagger.io/v2');
      });

      it('should correctly init api url if both http and https', ()=> {
        specMgr._schema.schemes.push('https');
        specMgr.init();
        specMgr.apiUrl.should.be.equal('https://petstore.swagger.io/v2');
      });

      it('should substitute api scheme when spec schemes are undefined', () => {
        specMgr._schema.schemes = undefined;
        specMgr._specUrl = 'https://petstore.swagger.io/v2';
        specMgr.init();
        specMgr.apiUrl.should.be.equal('https://petstore.swagger.io/v2');
      });

      it('should substitute api host when spec host is undefined', () => {
        specMgr._schema.host = undefined;
        specMgr._specUrl = 'http://petstore.swagger.io/v2';
        specMgr.init();
        specMgr.apiUrl.should.be.equal('http://petstore.swagger.io/v2');
      });

      it('should use empty basePath when basePath is not present', () => {
        specMgr._schema.basePath = undefined;
        specMgr._specUrl = 'https://petstore.swagger.io';
        specMgr.init();
        specMgr.basePath.should.be.equal('');
      });

      describe('byPointer method', () => {
        it('should return correct schema part', ()=> {
          let part = specMgr.byPointer('/tags/0');
          part.should.be.deepEqual(specMgr.schema.tags[0]);
          part.should.be.equal(specMgr.schema.tags[0]);
        });

        it('should return null for incorrect pointer', ()=> {
          let part = specMgr.byPointer('/incorrect/pointer');
          expect(part).toBeNull();
        });
      });
    });

    describe('getTagsMap method', () => {
      beforeEach(function () {
        specMgr._schema = {
          tags: [
            {name: 'tag1', description: 'info1'},
            {name: 'tag2', description: 'info2', 'x-traitTag': true}
          ]
        };
      });

      it('should return correct tags map', () => {
        let tagsMap = specMgr.getTagsMap();
        let expectedResult = {
          tag1: {description: 'info1', 'x-traitTag': false},
          tag2: {description: 'info2', 'x-traitTag': true}
        };
        tagsMap.should.be.deepEqual(expectedResult);
      });

      it('should return empty array for non-specified tags', () => {
        delete specMgr._schema.tags;
        let tagsMap = specMgr.getTagsMap();
        tagsMap.should.be.empty();
      });
    });

    describe('getMethodParams method', () => {
      beforeEach((done:any) => {
        specMgr.load('/tests/schemas/schema-mgr-methodparams.json').then(done, done.fail);
      });

      it('should propagate path parameters', () => {
        let params = specMgr.getMethodParams('/paths/test1/get');
        params.length.should.be.equal(2);
        params[0].name.should.be.equal('methodParam');
        params[1].name.should.be.equal('pathParam');
      });

      it('should inject correct pointers', () => {
        let params = specMgr.getMethodParams('/paths/test1/get');
        params[0]._pointer.should.be.equal('/paths/test1/get/parameters/0');
        params[1]._pointer.should.be.equal('/paths/test1/parameters/0');
      });

      it('should accept pointer directly to parameters', () => {
        let params = specMgr.getMethodParams('/paths/test1/get/parameters');
        expect(params).not.toBeNull();
        params.length.should.be.equal(2);
      });

      it('should resolve path params from Parameters Definitions Object', () => {
        let params = specMgr.getMethodParams('/paths/test2/get');
        params.length.should.be.equal(2);
        params[0].name.should.be.equal('methodParam');
        params[1].name.should.be.equal('extParam');
        params[1]._pointer.should.be.equal('#/parameters/extparam');
      });

      it('should resolve method params from Parameters Definitions Object', () => {
        let params = specMgr.getMethodParams('/paths/test3/get');
        params.length.should.be.equal(1);
        params[0].name.should.be.equal('extParam');
        params[0]._pointer.should.be.equal('#/parameters/extparam');
      });

      it('should throw for parameters other than array', () => {
        let func = () => specMgr.getMethodParams('/paths/test4/get');
        expect(func).toThrow();
      });
    });

    describe('findDerivedDefinitions method', () => {
      beforeEach((done) => {
        specMgr.load('/tests/schemas/extended-petstore.yml').then(done, done.fail);
      });

      it('should find derived definitions for Pet', () => {
        let deriveDefs = specMgr.findDerivedDefinitions('#/definitions/Pet');
        deriveDefs.should.be.instanceof(Array);
        deriveDefs.should.not.be.empty();
        deriveDefs.should.be.deepEqual([
          {name: 'Cat', $ref: '#/definitions/Cat'},
          {name: 'Dog', $ref: '#/definitions/Dog'}
        ]);
      });

      it('should return emtpy array for definitions that dont have discriminator', () => {
        let deriveDefs = specMgr.findDerivedDefinitions('#/definitions/Order');
        deriveDefs.should.be.instanceof(Array);
        deriveDefs.should.be.empty();
      });

      it('should correctly work with x-extendedDiscriminator', () => {
        specMgr._schema = {
          definitions: xExtendedDefs
        };

        let deriveDefs = specMgr.findDerivedDefinitions('#/definitions/Payment');
        deriveDefs.should.be.instanceof(Array);
        deriveDefs.should.be.deepEqual([
          {
            name: 'cash',
            $ref: '#/definitions/CashPayment'
          }, {
            name: 'paypal',
            $ref: '#/definitions/PayPalPayment'
        }])
      });
    });
  });
});
