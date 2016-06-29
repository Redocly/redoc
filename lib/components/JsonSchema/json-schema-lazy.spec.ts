'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component, provide } from '@angular/core';

import {
  inject,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';


import { JsonSchemaLazy } from './json-schema-lazy';
import { SpecManager } from '../../utils/SpecManager';

describe('Redoc components', () => {
  describe('JsonSchemaLazy Component', () => {
    let builder;
    let component;
    let specMgr = new SpecManager();
    let fixture;
    beforeEachProviders(() => [
        provide(SpecManager, {useValue: specMgr})
    ]);
    beforeEach(inject([TestComponentBuilder], (tcb, dcl) => {
      builder = tcb;
    }));
    beforeEach((done) => {
      builder.createAsync(TestAppComponent).then(_fixture => {
        fixture = _fixture;
        let debugEl = getChildDebugElement(fixture.debugElement, 'json-schema-lazy');
        component = <JsonSchemaLazy>debugEl.componentInstance;
        spyOn(component, '_loadAfterSelf').and.callThrough();
        done();
      }, err => done.fail(err));
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

    it('should not run loadNextToLocation if already loaded', () => {
      component.pointer = '#/def';
      fixture.detectChanges();
      component.load();
      component.load();
      expect(component._loadAfterSelf.calls.count()).toEqual(1);
    });
  });
});


/** Test component that contains a Method. */
@Component({
  selector: 'test-app',
  directives: [JsonSchemaLazy],
  template:
      `<json-schema-lazy></json-schema-lazy>`
})
class TestAppComponent {
}
