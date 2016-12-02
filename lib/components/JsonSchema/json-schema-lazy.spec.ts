'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';

import {
  inject,
  TestBed
} from '@angular/core/testing';

import { JsonSchemaLazy } from './json-schema-lazy';

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
  });

  describe('JsonSchemaLazy Component', () => {
    let builder;
    let component;
    let fixture;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppComponent);
      let debugEl = getChildDebugElement(fixture.debugElement, 'json-schema-lazy');
      component = <JsonSchemaLazy>debugEl.componentInstance;
      spyOn(component, '_loadAfterSelf').and.stub();
    });

    afterEach(() => {
      component._loadAfterSelf.and.callThrough();
    });

    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should run loadNextToLocation on load', () => {
      component.pointer = '#/def';
      fixture.detectChanges();
      component.load();
      expect(component._loadAfterSelf).toHaveBeenCalled();
    });
  });
});


/** Test component that contains a Method. */
@Component({
  selector: 'test-app',
  template:
      `<json-schema-lazy></json-schema-lazy>`
})
class TestAppComponent {
}
