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


describe('jjj Component', () => {
  let builder;
  beforeEachProviders(() => [
      provide(SchemaManager, {useValue: new SchemaManager()})
  ]);
  beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
    builder = tcb;
    return schemaMgr.load('/tests/schemas/extended-petstore.json').then(() => null, (err) => { throw err; });
  }));


  it('should init component', (done) => {
    builder.createAsync(TestApp).then(fixture => {
      let component = getChildDebugElement(fixture.debugElement, 'method').componentInstance;
      expect(component).not.toBeNull();
      done();
    }, err => done.fail(err));
  });

  it('should init basic component data', (done) => {
    builder.createAsync(TestApp).then(fixture => {
      let component = getChildDebugElement(fixture.debugElement, 'method').componentInstance;
      fixture.detectChanges();

      component.data.apiUrl.should.be.equal('http://petstore.swagger.io/v2');
      component.data.httpMethod.should.be.equal('put');
      component.data.path.should.be.equal('/user/{username}');
      done();
    }, err => done.fail(err));
  });
});


/** Test component that contains an Method. */
@Component({selector: 'test-app'})
@View({
  directives: [Method],
  providers: [SchemaManager],
  template:
      `<method pointer='#/paths/~1user~1{username}/put'></method>`
})
class TestApp {
}
