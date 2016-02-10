'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, View, provide} from 'angular2/core';
import OptionsManager from 'lib/options';

import {
  TestComponentBuilder,
  inject,
  beforeEach,
  beforeEachProviders,
  it
} from 'angular2/testing';

import JsonSchema from 'lib/components/JsonSchema/json-schema';
import SchemaManager from 'lib/utils/SchemaManager';

describe('Redoc components', () => {
  describe('JsonSchema Component', () => {
    let builder;
    let component;
    let schemaMgr = new SchemaManager();
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: schemaMgr}),
        provide('OPTION_NAMES', {useValue: []}),
        provide(OptionsManager, {useClass: OptionsManager})
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
      schemaMgr._schema = {type: 'object'};
      fixture.detectChanges();
      expect(component).not.toBeNull();
    });

    it('should set isTrivial for non-object/array types', () => {
      component.pointer = '';
      schemaMgr._schema = {type: 'string'};
      fixture.detectChanges();
      component.isTrivial.should.be.true();
    });

    it('should use < * > notation for prop without type', () => {
      component.pointer = '';
      schemaMgr._schema = {type: 'object', properties: {
        test: {}
      }};
      fixture.detectChanges();
      component.data.properties[0]._displayType.should.be.equal('< * >');
    });
  });
});


/** Test component that contains a Method. */
@Component({selector: 'test-app'})
@View({
  directives: [JsonSchema],
  providers: [SchemaManager],
  template:
      `<json-schema></json-schema>`
})
class TestApp {
}
