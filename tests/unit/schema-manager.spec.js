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

  describe("load method", ()=> {
    let req = null;
    let xhr = null;
    before(function () {
      // fake XHR
      xhr = sinon.useFakeXMLHttpRequest();
    });


    it("should return a promise", ()=> {
      schemaMgr.load('http://test').should.be.instanceof(Promise);
    });

    it("should reject promise for non-existing schema", (done)=> {
      schemaMgr.load('http://test').then(() => {
        throw new Error("Should not be called")
      }, (err) => {
        done();
      });
    });

    after(function () {
      xhr.restore();
    });
  })
})
