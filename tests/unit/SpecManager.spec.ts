'use strict';

import { SpecManager } from '../../lib/utils/SpecManager';
describe('Utils', () => {
  describe('Schema manager', () => {
    let specMgr;

    beforeEach(() => {
      specMgr = new SpecManager();
    });

    it('Should be a singleton', ()=> {
      (new SpecManager()).should.be.equal(specMgr);
      SpecManager.instance().should.be.equal(specMgr);
    });

    it('load should return a promise', ()=> {
      specMgr.load('/tests/schemas/extended-petstore.yml').should.be.instanceof(Promise);
    });

    it('load should reject promise for invalid url', (done)=> {
      specMgr.load('/nonexisting/schema.json').then(() => {
        throw new Error('Succees handler should not be called');
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
      beforeAll(function (done) {
        specMgr.load('/tests/schemas/extended-petstore.yml').then(() => {
          done();
        }, () => {
          throw new Error('Error handler should not be called');
        });
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

      it('should substitute api host when spec host is undefined', () => {
        specMgr._schema.host = undefined;
        specMgr._url = 'https://petstore.swagger.io/v2';
        specMgr.init();
        specMgr.apiUrl.should.be.equal('https://petstore.swagger.io/v2');
      });

      describe('byPointer method', () => {
        it('should return correct schema part', ()=> {
          let part = specMgr.byPointer('/tags/3');
          part.should.be.deepEqual(specMgr.schema.tags[3]);
          part.should.be.equal(specMgr.schema.tags[3]);
        });

        it('should return null for incorrect pointer', ()=> {
          let part = specMgr.byPointer('/incorrect/pointer');
          expect(part).toBeNull();
        });
      });
    });

    describe('getTagsMap method', () => {
      beforeAll(function () {
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
      beforeAll((done) => {
        specMgr.load('/tests/schemas/schema-mgr-methodparams.json').then(() => {
          done();
        }, () => {
          done(new Error('Error handler should not be called'));
        });
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
        let params = specMgr.getMethodParams('/paths/test1/get/parameters', true);
        expect(params).not.toBeNull();
        params.length.should.be.equal(2);
      });

      it('should resolve path params from Parameters Definitions Object', () => {
        let params = specMgr.getMethodParams('/paths/test2/get', true);
        params.length.should.be.equal(2);
        params[0].name.should.be.equal('methodParam');
        params[1].name.should.be.equal('extParam');
        params[1]._pointer.should.be.equal('#/parameters/extparam');
      });

      it('should resolve method params from Parameters Definitions Object', () => {
        let params = specMgr.getMethodParams('/paths/test3/get', true);
        params.length.should.be.equal(1);
        params[0].name.should.be.equal('extParam');
        params[0]._pointer.should.be.equal('#/parameters/extparam');
      });

      it('should throw for parameters other than array', () => {
        let func = () => specMgr.getMethodParams('/paths/test4/get', true);
        expect(func).toThrow();
      });
    });

    describe('findDerivedDefinitions method', () => {
      beforeAll((done) => {
        specMgr.load('/tests/schemas/extended-petstore.yml').then(() => {
          done();
        }, () => {
          done(new Error('Error handler should not be called'));
        });
      });

      it('should find derived definitions for Pet', () => {
        let deriveDefs = specMgr.findDerivedDefinitions('#/definitions/Pet');
        deriveDefs.should.be.instanceof(Array);
        deriveDefs.should.not.be.empty();
        deriveDefs.should.be.deepEqual([
          {name: 'Cat', empty: false, $ref: '#/definitions/Cat'},
          {name: 'Dog', empty: false, $ref: '#/definitions/Dog'}
        ]);
      });

      it('should return emtpy array for definitions that dont have discriminator', () => {
        let deriveDefs = specMgr.findDerivedDefinitions('#/definitions/Order');
        deriveDefs.should.be.instanceof(Array);
        deriveDefs.should.be.empty();
      });
    });
  });
});
