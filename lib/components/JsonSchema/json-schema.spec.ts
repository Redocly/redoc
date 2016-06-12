'use strict';

import { Component, provide } from '@angular/core';
import {
  inject,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';

import { getChildDebugElement } from '../../../tests/helpers';


import { JsonSchema } from './json-schema';
import { SchemaManager } from '../../utils/SchemaManager';;

describe('Redoc components', () => {
  describe('JsonSchema Component', () => {
    let builder;
    let component;
    let schemaMgr = new SchemaManager();
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: schemaMgr})
    ]);
    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        let debugEl = getChildDebugElement(fixture.debugElement, 'json-schema');
        component = debugEl.componentInstance;
        done();
      }, err => done.fail(err));
    });

    it('should init component', () => {
      component.pointer = '';
      (<any>schemaMgr)._schema = {type: 'object'};
      fixture.detectChanges();
      expect(component).not.toBeNull();
    });

    it('should set isTrivial for non-object/array types', () => {
      component.pointer = '';
      (<any>schemaMgr)._schema = {type: 'string'};
      fixture.detectChanges();
      component.schema.isTrivial.should.be.true();
    });

    it('should use < * > notation for prop without type', () => {
      component.pointer = '';
      (<any>schemaMgr)._schema = {type: 'object', properties: {
        test: {}
      }};
      fixture.detectChanges();
      component.schema.properties[0]._displayType.should.be.equal('< * >');
    });
  });
});


/** Test component that contains a Method. */
@Component({
  selector: 'test-app',
  directives: [JsonSchema],
  providers: [SchemaManager],
  template:
      `<json-schema></json-schema>`
})
class TestApp {
}
