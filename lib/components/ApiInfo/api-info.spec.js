'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, provide} from 'angular2/core';

import {
  TestComponentBuilder,
  async,
  inject,
  beforeEach,
  beforeEachProviders,
  it
} from 'angular2/testing';

import ApiInfo from 'lib/components/ApiInfo/api-info';
import SchemaManager from 'lib/utils/SchemaManager';
import OptionsManager from 'lib/options';

let optsMgr = new OptionsManager();

describe('Redoc components', () => {
  describe('ApiInfo Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()}),
        provide(OptionsManager, {useValue: optsMgr})
    ]);

    beforeEach(async(inject([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/api-info-test.json');
    })));

    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        component = getChildDebugElement(fixture.debugElement, 'api-info').componentInstance;
        fixture.detectChanges();
        done();
      }, err => done.fail(err));
    });


    it('should init component data', () => {
      expect(component).not.toBeNull();
      expect(component.data).not.toBeNull();
      component.data.title.should.be.equal('Swagger Petstore');
    });

    it('should render api name and version', () => {
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-info').nativeElement;
      let headerElement = nativeElement.querySelector('h1');
      expect(headerElement).toHaveText('Swagger Petstore (1.0.0)');
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  directives: [ApiInfo],
  template:
      `<api-info></api-info>`
})
class TestApp {
}
