'use strict';

import SchemaManager from 'lib/utils/SchemaManager';
describe('Utils', () => {
  describe('Schema manager', () => {
    let schemaMgr;

    beforeEach(() => {
      schemaMgr = new SchemaManager();
    });

    it('Should initialize with empty schema', ()=> {
      schemaMgr.schema.should.be.empty;
    });

    it('Should be a singleton', ()=> {
      (new SchemaManager()).should.be.equal(schemaMgr);
      SchemaManager.instance().should.be.equal(schemaMgr);
    });

    it('load should return a promise', ()=> {
      schemaMgr.load('/tests/schemas/extended-petstore.yml').should.be.instanceof(Promise);
    });

    it('load should reject promise for invalid url', (done)=> {
      schemaMgr.load('/nonexisting/schema.json').then(() => {
        throw new Error('Succees handler should not be called');
      }, () => {
        done();
      });
    });

    it('load should resolve promise for valid url', (done)=> {
      schemaMgr.load('/tests/schemas/extended-petstore.yml').then(() => {
        done();
      }, () => {
        throw new Error('Error handler should not be called');
      });
    });

    describe('Schema manager basic functionality', ()=> {
      beforeAll(function (done) {
        schemaMgr.load('/tests/schemas/extended-petstore.yml').then(() => {
          done();
        }, () => {
          throw new Error('Error handler should not be called');
        });
      });


      it('should contain non-empty schema', ()=> {
        schemaMgr.schema.should.be.an.Object();
        schemaMgr.schema.should.be.not.empty;
      });

      it('should correctly init api url', ()=> {
        schemaMgr.apiUrl.should.be.equal('http://petstore.swagger.io/v2');
      });

      describe('byPointer method', () => {
        it('should return correct schema part', ()=> {
          let part = schemaMgr.byPointer('/tags/3');
          part.should.be.deepEqual(schemaMgr.schema.tags[3]);
          part.should.be.equal(schemaMgr.schema.tags[3]);
        });

        it('should return null for incorrect pointer', ()=> {
          let part = schemaMgr.byPointer('/incorrect/pointer');
          expect(part).toBeNull();
        });
      });
    });

    describe('getTagsMap method', () => {
      beforeAll(function () {
        schemaMgr._schema = {
          tags: [
            {name: 'tag1', description: 'info1'},
            {name: 'tag2', description: 'info2', 'x-traitTag': true}
          ]
        };
      });

      it('should return correct tags map', () => {
        let tagsMap = schemaMgr.getTagsMap();
        let expectedResult = {
          tag1: {description: 'info1', 'x-traitTag': false},
          tag2: {description: 'info2', 'x-traitTag': true}
        };
        tagsMap.should.be.deepEqual(expectedResult);
      });

      it('should return empty array for non-specified tags', () => {
        delete schemaMgr._schema.tags;
        let tagsMap = schemaMgr.getTagsMap();
        tagsMap.should.be.empty;
      });
    });

    describe('buildMenuTree method', () => {
      let suitSchema = {
        tags: [
          {name: 'tag1', description: 'info1', 'x-traitTag': true},
          {name: 'tag2', description: 'info2'}
        ],
        paths: {
          test: {
            put: {
              tags: ['tag1', 'tag3'],
              summary: 'test put'
            },
            get: {
              tags: ['tag1', 'tag2'],
              summary: 'test get'
            },
            // no tags
            post: {
              summary: 'test post'
            }
          }
        }
      };

      let menuTree;
      let entries;

      beforeAll(() => {
        schemaMgr._schema = suitSchema;
        menuTree = schemaMgr.buildMenuTree();
        entries = Array.from(menuTree.entries());
      });

      it('should return instance of Map', () => {
        menuTree.should.be.instanceof(Map);
      });

      it('should return Map with correct number of entries', () => {
        //2 - defined tags, 1 - tag3 and 1 [other] tag for no-tags method
        entries.length.should.be.equal(2 + 1 + 1);
      });

      it('should append not defined tags to the end of list', () => {
        let [tag, info] = entries[2];
        tag.should.be.equal('tag3');
        info.methods.length.should.be.equal(1);
        info.methods[0].summary.should.be.equal('test put');
      });

      it('should append methods without tags to [other] tag', () => {
        let [tag, info] = entries[3];
        tag.should.be.equal('[Other]');
        info.methods.length.should.be.equal(1);
        info.methods[0].summary.should.be.equal('test post');
      });

      it('should map x-traitTag to empty methods list', () => {
        let [, info] = entries[0];
        info['x-traitTag'].should.be.true;
        info.methods.should.be.empty;
      });

      it('methods for tag should contain valid pointer and summary', () => {
        for (let entr of entries) {
          let [, info] = entr;
          info.should.be.an.Object();
          info.methods.should.be.an.Array();
          for (let methodInfo of info.methods) {
            methodInfo.should.have.keys('pointer', 'summary');
            let methSchema = schemaMgr.byPointer(methodInfo.pointer);
            expect(methSchema).not.toBeNull();
            if (methSchema.summary) {
              methSchema.summary.should.be.equal(methodInfo.summary);
            }
          }
        }
      });
    });

    describe('getMethodParams method', () => {
      beforeAll((done) => {
        schemaMgr.load('/tests/schemas/schema-mgr-methodparams.json').then(() => {
          done();
        }, () => {
          done(new Error('Error handler should not be called'));
        });
      });

      it('should propagate path parameters', () => {
        let params = schemaMgr.getMethodParams('/paths/test1/get');
        params.length.should.be.equal(2);
        params[0].name.should.be.equal('methodParam');
        params[1].name.should.be.equal('pathParam');
      });

      it('should inject correct pointers', () => {
        let params = schemaMgr.getMethodParams('/paths/test1/get');
        params[0]._pointer.should.be.equal('/paths/test1/get/parameters/0');
        params[1]._pointer.should.be.equal('/paths/test1/parameters/0');
      });

      it('should accept pointer directly to parameters', () => {
        let params = schemaMgr.getMethodParams('/paths/test1/get/parameters', true);
        expect(params).not.toBeNull();
        params.length.should.be.equal(2);
      });

      it('should resolve path params from Parameters Definitions Object', () => {
        let params = schemaMgr.getMethodParams('/paths/test2/get', true);
        params.length.should.be.equal(2);
        params[0].name.should.be.equal('methodParam');
        params[1].name.should.be.equal('extParam');
        params[1]._pointer.should.be.equal('#/parameters/extparam');
      });

      it('should resolve method params from Parameters Definitions Object', () => {
        let params = schemaMgr.getMethodParams('/paths/test3/get', true);
        params.length.should.be.equal(1);
        params[0].name.should.be.equal('extParam');
        params[0]._pointer.should.be.equal('#/parameters/extparam');
      });

      it('should throw for parameters other than array', () => {
        let func = () => schemaMgr.getMethodParams('/paths/test4/get', true);
        expect(func).toThrow();
      });
    });

    describe('findDerivedDefinitions method', () => {
      beforeAll((done) => {
        schemaMgr.load('/tests/schemas/extended-petstore.yml').then(() => {
          done();
        }, () => {
          done(new Error('Error handler should not be called'));
        });
      });

      it('should find derived definitions for Pet', () => {
        let deriveDefs = schemaMgr.findDerivedDefinitions('#/definitions/Pet');
        deriveDefs.should.be.instanceof(Array);
        deriveDefs.should.not.be.empty();
        deriveDefs.should.be.deepEqual([{name: 'Cat', $ref: '#/definitions/Cat'}, {name: 'Dog', $ref: '#/definitions/Dog'}]);
      });

      it('should return emtpy array for definitions that dont have discriminator', () => {
        let deriveDefs = schemaMgr.findDerivedDefinitions('#/definitions/Order');
        deriveDefs.should.be.instanceof(Array);
        deriveDefs.should.be.empty;
      });
    });
  });
});
