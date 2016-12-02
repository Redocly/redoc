'use strict';

import { Component } from '@angular/core';
import {
  inject,
  TestBed
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';

import { SpecManager } from '../../utils/spec-manager';;

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
  });
  describe('JsonSchema Component', () => {
    let builder;
    let component;
    let fixture;
    let specMgr;

    beforeEach(inject([SpecManager], ( _spec) => {

      specMgr = _spec;
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppComponent);
      let debugEl = getChildDebugElement(fixture.debugElement, 'json-schema');
      component = debugEl.componentInstance;
    });

    it('should init component', () => {
      component.pointer = '';
      (<SpecManager>specMgr)._schema = {type: 'object'};
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
  template:
      `<json-schema></json-schema>`
})
class TestAppComponent {
}
