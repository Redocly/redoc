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

import Method from 'lib/components/Method/method';
import SchemaManager from 'lib/utils/SchemaManager';

describe('Redoc components', () => {
  describe('Method Component', () => {
    let builder;
    let component;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()})
    ]);
    beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/extended-petstore.yml').then(() => null, (err) => { throw err; });
    }));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(fixture => {
        component = getChildDebugElement(fixture.debugElement, 'method').componentInstance;
        fixture.detectChanges();
        done();
      }, err => done.fail(err));
    });


    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should init basic component data', () => {
      component.data.apiUrl.should.be.equal('http://petstore.swagger.io/v2');
      component.data.httpMethod.should.be.equal('put');
      component.data.path.should.be.equal('/user/{username}');
    });


    it('should main tag', () => {
      component.data.methodInfo.tags.should.be.empty;
    });
  });
});


/** Test component that contains a Method. */
@Component({selector: 'test-app'})
@View({
  directives: [Method],
  providers: [SchemaManager],
  template:
      `<method pointer='#/paths/~1user~1{username}/put'></method>`
})
class TestApp {
}
