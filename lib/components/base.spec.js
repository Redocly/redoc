'use strict';

import SchemaManager from 'lib/utils/SchemaManager';
import {BaseComponent} from 'lib/components/base';

describe('BaseComponent', () => {
  let schemaMgr;
  let component;

  before(() => {
    schemaMgr = new SchemaManager();
    schemaMgr._schema = {tags: []};
  });

  beforeEach(() => {
    component = new BaseComponent(schemaMgr);
  });

  it('should set instance properties', () => {
    component.schemaMgr.should.be.equal(schemaMgr);
    component.schema.should.be.an('object');
    expect(component.componentSchema).to.not.exist;
  });

  it('should set componentSchema based on pointer on ngOnInit', () => {
    component.pointer = '/tags';
    component.ngOnInit();
    component.componentSchema.should.be.equal(schemaMgr._schema.tags);
  });

  it('should call prepareModel and init virtual methods after init', () => {
    sinon.spy(component, 'prepareModel');
    sinon.spy(component, 'init');
    component.ngOnInit();
    component.prepareModel.calledOnce.should.be.true;
    component.init.calledOnce.should.be.true;
  });

  describe('dereference', () => {
    before(() => {
      return schemaMgr.load('/tests/schemas/base-component-dereference.json');
    });

    describe('simple dereference', () => {
      let paramWithRef;
      before(() => {
        component.pointer = '/paths/test1/get';
        component.ngOnInit();
        component.dereference();
        paramWithRef = component.componentSchema.parameters[0];
      });

      it('should not contain $ref property', () => {
        expect(paramWithRef.$ref).to.not.exist;
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
        paramWithRef.should.be.deep.equal(schemaMgr.schema.definitions.Simple);
      });
    });

    describe('nested dereference', () => {
      let paramWithRef;
      before(() => {
        component.pointer = '/paths/test2/get';
        component.ngOnInit();
        component.dereference();
        paramWithRef = component.componentSchema.parameters[0];
      });

      it('should not touch title if exist', () => {
        paramWithRef.title.should.be.equal('NesteTitle');
      });

      it('should resolve nested schema', () => {
        expect(paramWithRef.properties.subschema.$ref).to.not.exist;
        paramWithRef._pointer.should.be.equal('#/definitions/Nested');
        paramWithRef.properties.subschema._pointer.should.be.equal('#/definitions/Simple');
        paramWithRef.properties.subschema.type.should.be.equal('object');
      });
    });

    describe('array schema dereference', () => {
      let paramWithRef;
      before(() => {
        component.pointer = '/paths/test3/get';
        component.ngOnInit();
        component.dereference();
        paramWithRef = component.componentSchema.parameters[0];
      });

      it('should resolve array schema', () => {
        expect(paramWithRef.$ref).to.not.exist;
        expect(paramWithRef.items.schema.$ref).to.not.exist;
        paramWithRef.type.should.be.equal('array');
        paramWithRef._pointer.should.be.equal('#/definitions/ArrayOfSimple');
        paramWithRef.items.schema._pointer.should.be.equal('#/definitions/Simple');
        paramWithRef.items.schema.type.should.be.equal('object');
      });
    });
  });

  describe('mergeAllOf', () => {
    before(() => {
      return schemaMgr.load('tests/schemas/base-component-joinallof.json');
    });

    describe('Simple allOf merge', () => {
      let joined;
      before(() => {
        component.pointer = '/definitions/SimpleAllOf';
        component.ngOnInit();
        component.dereference();
        component.joinAllOf();
        joined = component.componentSchema;
      });

      it('should remove $allOf field', () => {
        expect(joined.allOf).to.not.exist;
      });

      it('should set type object', () => {
        joined.type.should.be.equal('object');
      });

      it('should merge properties', () => {
        Object.keys(joined.properties).length.should.be.equal(3);
        Object.keys(joined.properties).should.be.deep.equal(['prop1', 'prop2', 'prop3']);
      });

      it('should merge required', () => {
        joined.required.length.should.be.equal(2);
        joined.required.should.be.deep.equal(['prop1', 'prop3']);
      });
    });

    describe('AllOf with refrence', () => {
      let joined;
      before(() => {
        component.pointer = '/definitions/AllOfWithRef';
        component.ngOnInit();
        component.dereference();
        component.joinAllOf();
        joined = component.componentSchema;
      });

      it('should remove $allOf field', () => {
        expect(joined.allOf).to.not.exist;
      });

      it('should set type object', () => {
        joined.type.should.be.equal('object');
      });

      it('should merge properties', () => {
        Object.keys(joined.properties).length.should.be.equal(2);
        Object.keys(joined.properties).should.be.deep.equal(['id', 'prop3']);
      });

      it('should merge required', () => {
        joined.required.length.should.be.equal(2);
        joined.required.should.be.deep.equal(['id', 'prop3']);
      });
    });

    describe('Incorrect or not supported allOf', () => {
      it('should throw when properties or required is set on the same level as allOf', () => {
        component.pointer = '/definitions/BadAllOf2';
        component.ngOnInit();
        component.dereference();
        component.joinAllOf.bind(component).should.throw();
      });

      it('should throw when merging non-object schemas', () => {
        component.pointer = '/definitions/BadAllOf1';
        component.ngOnInit();
        component.dereference();
        component.joinAllOf.bind(component).should.throw();
      });
    });

    describe.skip('Merge array allOf', () => {
    });
  });
});
