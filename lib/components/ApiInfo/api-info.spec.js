'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, View, provide} from 'angular2/core';

import {
  TestComponentBuilder,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  it
} from 'angular2/testing';

import ApiInfo from 'lib/components/ApiInfo/api-info';
import SchemaManager from 'lib/utils/SchemaManager';


describe('Redoc components', () => {
  describe('ApiInfo Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()})
    ]);
    beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/api-info-test.json').then(() => null, (err) => { throw err; });
    }));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        component = getChildDebugElement(fixture.debugElement, 'api-info').componentInstance;
        fixture.detectChanges();
        done();
      }, err => done.fail(err));
    });


    it('shold init component data', () => {
      expect(component).not.toBeNull();
      expect(component.data).not.toBeNull();
      component.data.title.should.be.equal('Swagger Petstore');
    });

    it('shold render api name and version', () => {
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-info').nativeElement;
      let headerElement = nativeElement.querySelector('h1');
      expect(headerElement).toHaveText('Swagger Petstore (1.0.0)');
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({selector: 'test-app'})
@View({
  directives: [ApiInfo],
  providers: [SchemaManager],
  template:
      `<api-info></api-info>`
})
class TestApp {
}
