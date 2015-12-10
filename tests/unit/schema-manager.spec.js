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

    it("byPointer should return correct schema part", ()=> {
      var part = schemaMgr.byPointer('/tags/3');
      part.should.be.deep.equal({
        name: "store",
        description: "Access to Petstore orders"
      });
    });
  })
})
