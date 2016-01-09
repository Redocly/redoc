'use strict';

import SchemaManager from 'lib/utils/SchemaManager';
import {BaseComponent} from 'lib/components/base';

describe('Redoc components', () => {
  describe('BaseComponent', () => {
    let schemaMgr;
    let component;

    beforeAll(() => {
      schemaMgr = new SchemaManager();
      schemaMgr._schema = {tags: []};
    });

    beforeEach(() => {
      component = new BaseComponent(schemaMgr);
    });

    it('should set instance properties', () => {
      component.schemaMgr.should.be.equal(schemaMgr);
      component.schema.should.be.of.type('object');
      expect(component.componentSchema).toBeNull();
    });

    it('should set componentSchema based on pointer on ngOnInit', () => {
      component.pointer = '/tags';
      component.ngOnInit();
      component.componentSchema.should.be.deepEqual(schemaMgr._schema.tags);
    });

    it('should call prepareModel and init virtual methods after init', () => {
      sinon.spy(component, 'prepareModel');
      sinon.spy(component, 'init');
      component.ngOnInit();
      component.prepareModel.calledOnce.should.be.true;
      component.init.calledOnce.should.be.true;
    });

    describe('dereference', () => {
      beforeAll((done) => {
        schemaMgr.load('/tests/schemas/base-component-dereference.json').then(
          () => done()
        );
      });

      describe('simple dereference', () => {
        let paramWithRef;
        beforeAll(() => {
          component.pointer = '/paths/test1/get';
          component.ngOnInit();
          component.dereference();
          paramWithRef = component.componentSchema.parameters[0];
        });

        it('should not contain $ref property', () => {
          expect(paramWithRef.$ref).toBeUndefined();
        });

        it('should inject Title if not exist based on reference', () => {
          paramWithRef.title.should.be.equal('Simple');
        });

        it('should inject pointer', () => {
          paramWithRef._pointer.should.be.equal('#/definitions/Simple');
        });

        it('should insert correct definition instead of reference', () => {
          delete paramWithRef.title;
          delete paramWithRef._pointer;
          paramWithRef.should.be.deepEqual(schemaMgr.schema.definitions.Simple);
        });
      });

      describe('nested dereference', () => {
        let paramWithRef;
        beforeAll(() => {
          component.pointer = '/paths/test2/get';
          component.ngOnInit();
          component.dereference();
          paramWithRef = component.componentSchema.parameters[0];
        });

        it('should not touch title if exist', () => {
          paramWithRef.title.should.be.equal('NesteTitle');
        });

        it('should resolve nested schema', () => {
          expect(paramWithRef.properties.subschema.$ref).toBeUndefined();
          paramWithRef._pointer.should.be.equal('#/definitions/Nested');
          paramWithRef.properties.subschema._pointer.should.be.equal('#/definitions/Simple');
          paramWithRef.properties.subschema.type.should.be.equal('object');
        });
      });

      describe('array schema dereference', () => {
        let paramWithRef;
        beforeAll(() => {
          component.pointer = '/paths/test3/get';
          component.ngOnInit();
          component.dereference();
          paramWithRef = component.componentSchema.parameters[0];
        });

        it('should resolve array schema', () => {
          expect(paramWithRef.$ref).toBeUndefined();
          expect(paramWithRef.items.schema.$ref).toBeUndefined();
          paramWithRef.type.should.be.equal('array');
          paramWithRef._pointer.should.be.equal('#/definitions/ArrayOfSimple');
          paramWithRef.items.schema._pointer.should.be.equal('#/definitions/Simple');
          paramWithRef.items.schema.type.should.be.equal('object');
        });
      });
    });

    describe('mergeAllOf', () => {
      beforeAll((done) => {
        schemaMgr.load('tests/schemas/base-component-joinallof.json').then(() => done());
      });

      describe('Simple allOf merge', () => {
        let joined;
        beforeAll(() => {
          component.pointer = '/definitions/SimpleAllOf';
          component.ngOnInit();
          component.dereference();
          component.joinAllOf();
          joined = component.componentSchema;
        });

        it('should remove $allOf field', () => {
          expect(joined.allOf).toBeNull();
        });

        it('should set type object', () => {
          joined.type.should.be.equal('object');
        });

        it('should merge properties', () => {
          Object.keys(joined.properties).length.should.be.equal(3);
          Object.keys(joined.properties).should.be.deepEqual(['prop1', 'prop2', 'prop3']);
        });

        it('should merge required', () => {
          joined.required.length.should.be.equal(2);
          joined.required.should.be.deepEqual(['prop1', 'prop3']);
        });
      });

      describe('AllOf with refrence', () => {
        let joined;
        beforeAll(() => {
          component.pointer = '/definitions/AllOfWithRef';
          component.ngOnInit();
          component.dereference();
          component.joinAllOf();
          joined = component.componentSchema;
        });

        it('should remove $allOf field', () => {
          expect(joined.allOf).toBeNull();
        });

        it('should set type object', () => {
          joined.type.should.be.equal('object');
        });

        it('should merge properties', () => {
          Object.keys(joined.properties).length.should.be.equal(2);
          Object.keys(joined.properties).should.be.deepEqual(['id', 'prop3']);
        });

        it('should merge required', () => {
          joined.required.length.should.be.equal(2);
          joined.required.should.be.deepEqual(['id', 'prop3']);
        });
      });

      describe('Incorrect or not supported allOf', () => {
        it('should throw when properties or required is set on the same level as allOf', () => {
          component.pointer = '/definitions/BadAllOf2';
          component.ngOnInit();
          component.dereference();
          (() => component.joinAllOf()).should.throw();
        });

        it('should throw when merging non-object schemas', () => {
          component.pointer = '/definitions/BadAllOf1';
          component.ngOnInit();
          component.dereference();
          (() => component.joinAllOf()).should.throw();
        });
      });

      xdescribe('Merge array allOf', () => {
      });
    });
  });
});
