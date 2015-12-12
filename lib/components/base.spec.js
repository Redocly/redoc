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

  it('should set componentSchema based on pointer on onInit', () => {
    component.pointer = '/tags';
    component.onInit();
    component.componentSchema.should.be.equal(schemaMgr._schema.tags);
  });

  it('should call prepareModel and init virtual methods after init', () => {
    sinon.spy(component, 'prepareModel');
    sinon.spy(component, 'init');
    component.onInit();
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
        component.onInit();
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
        component.onInit();
        component.dereference();
        paramWithRef = component.componentSchema.parameters[0];
      });

      it('should not touch title if exist', () => {
        paramWithRef.title.should.be.equal('NesteTitle');
      });

      it('should resolve nested schema', () => {
        expect(paramWithRef.properties.subschema.$ref).to.not.exist;
        paramWithRef.properties.subschema._pointer.should.be.equal('#/definitions/Simple');
        paramWithRef.properties.subschema.type.should.be.equal('object');
      });
    });
  });
});
