'use strict';

import { SpecManager } from '../utils/SpecManager';
import { BaseComponent } from '../components/base';

describe('Redoc components', () => {
  describe('BaseComponent', () => {
    let specMgr;
    let component;

    beforeAll(() => {
      specMgr = new SpecManager();
      specMgr._schema = {tags: []};
    });

    beforeEach(() => {
      component = new BaseComponent(specMgr);
    });

    it('should set instance properties', () => {
      component.specMgr.should.be.equal(specMgr);
      //component.schema.should.be.of.type('object');
      expect(component.componentSchema).toBeNull();
    });

    it('should set componentSchema based on pointer on ngOnInit', () => {
      component.pointer = '/tags';
      component.ngOnInit();
      component.componentSchema.should.be.deepEqual(specMgr._schema.tags);
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
