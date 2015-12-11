'use strict';

import SchemaManager from 'lib/utils/SchemaManager';
describe("Schema manager", () => {
  let schemaMgr;

  beforeEach(() => {
    schemaMgr = new SchemaManager();
  });

  it("Should initialize with empty schema", ()=> {
    schemaMgr.schema.should.be.empty;
  });

  it("Should be a singleton", ()=> {
    (new SchemaManager()).should.be.equal(schemaMgr);
  });

  it("load should return a promise", ()=> {
    schemaMgr.load('/tests/schemas/extended-petstore.json').should.be.instanceof(Promise);
  });

  it("load should resolve promise for valid url", (done)=> {
    schemaMgr.load('/tests/schemas/extended-petstore.json').then(() => {
      done();
    }, (err) => {
      throw new Error("Error handler should not be called")
    });
  });

  describe("Schema manager with loaded schema", ()=> {
    before(function (done) {
      schemaMgr.load('/tests/schemas/extended-petstore.json').then(() => {
        done();
      }, (err) => {
        throw new Error("Error handler should not be called")
      });
    });


    it("should contain non-empty schema", ()=> {
      schemaMgr.schema.should.be.an("object");
      schemaMgr.schema.should.be.not.empty;
    });

    it("should correctly init api url", ()=> {
      schemaMgr.apiUrl.should.be.equal("http://petstore.swagger.io/v2");
    });

    describe("byPointer method", () => {
      it("should return correct schema part", ()=> {
        let part = schemaMgr.byPointer('/tags/3');
        part.should.be.deep.equal(schemaMgr.schema.tags[3]);
        part.should.be.equal(schemaMgr.schema.tags[3]);
      });

      it("should return null for incorrect pointer", ()=> {
        let part = schemaMgr.byPointer('/incorrect/pointer');
        should.not.exist(part);
      });
    });

    describe("getTagsMap method", () => {
      it("should return correct tags map", () => {
        let tagsMap = schemaMgr.getTagsMap();
        let i = 0;
        let origTags = schemaMgr.schema.tags;

        origTags.length.should.be.equal(Object.keys(tagsMap).length);
        for (let tagName of Object.keys(tagsMap)) {
          tagName.should.be.equal(origTags[i].name);
          tagsMap[tagName].description.should.be.equal(origTags[i].description);
          if (origTags[i]['x-traitTag']) {
            tagsMap[tagName]['x-traitTag'].should.be.equal(origTags[i]['x-traitTag']);
          }
          i++;
        }
      });
    });

    describe("buildMenuTree method", () => {
      var menuTree;
      let entries;

      before(() => {
        menuTree = schemaMgr.buildMenuTree();
        entries = Array.from(menuTree.entries());
      });

      it("should return instance of Map", () => {
        menuTree.should.be.instanceof(Map);
      });

      it("should return Map with correct number of entries", () => {
        entries.length.should.be.at.least(schemaMgr.schema.tags.length);
      });

      it("methods for tag should contain valid pointer and summary", () => {
        for (let entr of entries) {
          let [tag, info] = entr;
          info.should.be.an("object");
          info.methods.should.be.an("array");
          for (let methodInfo of info.methods) {
            methodInfo.should.include.keys('pointer', 'summary');
            let methSchema = schemaMgr.byPointer(methodInfo.pointer);
            should.exist(methSchema);
            if (methSchema.summary) {
              methSchema.summary.should.be.equal(methodInfo.summary)
            }
          }
        }
      });

      it("should map x-traitTag to empty methods list", () => {
        for (let entr of entries) {
          let [tag, info] = entr;
          info.should.be.an("object");
          if (info['x-traitTag']) {
            info.methods.should.be.empty;
          }
        }
      });

    });
  });
});
