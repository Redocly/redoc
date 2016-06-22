'use strict';

import { SchemaManager } from '../utils/SchemaManager';
import { BaseComponent } from '../components/base';

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
      //component.schema.should.be.of.type('object');
      expect(component.componentSchema).toBeNull();
    });

    it('should set componentSchema based on pointer on ngOnInit', () => {
      component.pointer = '/tags';
      component.ngOnInit();
      component.componentSchema.should.be.deepEqual(schemaMgr._schema.tags);
    });

    it('should call prepareModel and init virtual methods after init', () => {
      spyOn(component, 'prepareModel');
      spyOn(component, 'init');
      component.ngOnInit();

      component.prepareModel.calls.count().should.be.equal(1);
      component.init.calls.count().should.be.equal(1);
      component.prepareModel.and.callThrough();
      component.init.and.callThrough();
    });
  });
});
