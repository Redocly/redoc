'use strict';

import { Component } from '@angular/core';
import {
  inject,
  TestComponentBuilder
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';


import { JsonSchema } from './json-schema';
import { SpecManager } from '../../utils/SpecManager';;

describe('Redoc components', () => {
  describe('JsonSchema Component', () => {
    let builder;
    let component;
    let fixture;
    let specMgr;

    beforeEach(inject([TestComponentBuilder, SpecManager], (tcb, _spec) => {
      builder = tcb;
      specMgr = _spec;
    }));

    beforeEach(() => {
      fixture = builder.createSync(TestAppComponent);
      let debugEl = getChildDebugElement(fixture.debugElement, 'json-schema');
      component = debugEl.componentInstance;
    });

    it('should init component', () => {
      component.pointer = '';
      (<any>specMgr)._schema = {type: 'object'};
      fixture.detectChanges();
      expect(component).not.toBeNull();
    });

    it('should set isTrivial for non-object/array types', () => {
      component.pointer = '#';
      (<any>specMgr)._schema = {type: 'string'};
      fixture.detectChanges();
      component.schema.isTrivial.should.be.true();
    });

    it('should use < anything > notation for prop without type', () => {
      component.pointer = '#';
      (<any>specMgr)._schema = {type: 'object', properties: {
        test: {}
      }};
      fixture.detectChanges();
      component.schema._properties[0]._displayType.should.be.equal('< anything >');
    });
  });
});


/** Test component that contains a Method. */
@Component({
  selector: 'test-app',
  directives: [JsonSchema],
  providers: [SpecManager],
  template:
      `<json-schema></json-schema>`
})
class TestAppComponent {
}
