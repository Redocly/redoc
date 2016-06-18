'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component, provide } from '@angular/core';
import { DynamicComponentLoader } from '@angular/core';

import {
  inject,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';


import { JsonSchemaLazy } from './json-schema-lazy';
import { SchemaManager } from '../../utils/SchemaManager';

describe('Redoc components', () => {
  describe('JsonSchemaLazy Component', () => {
    let builder;
    let component;
    let schemaMgr = new SchemaManager();
    let fixture;
    let loader;
    let appRefMock = {
      instance: {
        pointer: ''
      },
      hostView: { changeDetectorRef: {detectChanges : () => undefined} }
    };
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: schemaMgr})
    ]);
    beforeEach(inject([TestComponentBuilder, DynamicComponentLoader], (tcb, dcl) => {
      builder = tcb;
      loader = dcl;
      spyOn(loader, 'loadNextToLocation').and.returnValue({then: (fn) => fn(appRefMock)});
    }));
    beforeEach((done) => {
      builder.createAsync(TestAppComponent).then(_fixture => {
        fixture = _fixture;
        let debugEl = getChildDebugElement(fixture.debugElement, 'json-schema-lazy');
        component = <JsonSchemaLazy>debugEl.componentInstance;
        done();
      }, err => done.fail(err));
    });

    afterEach(() => {
      loader.loadNextToLocation.and.callThrough();
    });

    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should run loadNextToLocation on load', () => {
      component.pointer = '#/def';
      fixture.detectChanges();
      component.load();
      expect(loader.loadNextToLocation).toHaveBeenCalled();
    });

    it('should not run loadNextToLocation if already loaded', () => {
      component.pointer = '#/def';
      fixture.detectChanges();
      component.load();
      component.load();
      expect(loader.loadNextToLocation.calls.count()).toEqual(1);
    });

    it('should init json-schema with correct pointer', () => {
      component.pointer = '#/def';
      fixture.detectChanges();
      component.load();
      expect(appRefMock.instance.pointer).toEqual(component.pointer);
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
