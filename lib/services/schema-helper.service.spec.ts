'use strict';
import { SchemaHelper } from './schema-helper.service';
import { SpecManager } from '../utils/spec-manager';

describe('Spec Helper', () => {
  describe('buildMenuTree method', () => {
    let suitSchema = {
      tags: [
        {name: 'tag1', description: 'info1', 'x-traitTag': true},
        {name: 'tag2', description: 'info2'},
        {name: 'tag4', description: 'info2', 'x-displayName': 'Tag Four'}
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
          delete: {
            tags: ['tag4'],
            summary: 'test delete'
          },
          // no tags
          post: {
            summary: 'test post'
          }
        }
      }
    };

    let menuTree;
    let specMgr;

    beforeAll(() => {
      specMgr = new SpecManager();
      specMgr._schema = suitSchema;
      menuTree = SchemaHelper.buildMenuTree(suitSchema);
    });

    it('should return instance of Array', () => {
      menuTree.should.be.instanceof(Array);
    });

    it('should return Array with correct number of items', () => {
      //3 - defined tags, 1 - tag3 and 1 [other] tag for no-tags method
      menuTree.length.should.be.equal(3 + 1 + 1);
    });

    it('should append not defined tags to the end of list', () => {
      let info = menuTree[3];
      info.name.should.be.equal('tag3');
      info.methods.length.should.be.equal(1);
      info.methods[0].summary.should.be.equal('test put');
    });

    it('should append methods without tags to [other] tag', () => {
      let info = menuTree[4];
      info.name.should.be.equal('');
      info.methods.length.should.be.equal(1);
      info.methods[0].summary.should.be.equal('test post');
    });

    it('should map x-traitTag to empty section', () => {
      let info = menuTree[0];
      info.empty.should.be.true();
    });

    it('should map x-traitTag to empty methods list', () => {
      let info = menuTree[0];
      info.methods.should.be.empty();
    });

    it('methods for tag should contain valid pointer and summary', () => {
      for (let entr of menuTree) {
        let info = entr;
        info.should.be.an.Object();
        info.methods.should.be.an.Array();
        for (let methodInfo of info.methods) {
          methodInfo.should.have.properties(['pointer', 'summary']);
          let methSchema = specMgr.byPointer(methodInfo.pointer);
          expect(methSchema).not.toBeNull();
          if (methSchema.summary) {
            methSchema.summary.should.be.equal(methodInfo.summary);
          }
        }
      }
    });

    it('should use x-displayName to set custom names', () => {
      let info = menuTree[2];
      info.id.should.be.equal('tag/tag4');
      info.name.should.be.equal('Tag Four');
    });
  });

  describe('injectors', () => {
    it('should autodetect type if not-specified', () => {
      spyOn(console, 'warn').and.stub();
      let schema = {
        type: undefined,
        properties: {}
      };

      SchemaHelper.runInjectors(schema, schema, '#/');
      schema.type.should.be.equal('object');
      expect(console.warn).toHaveBeenCalled();
      (<jasmine.Spy>console.warn).and.callThrough();
    });
  });
});
