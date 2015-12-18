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


describe('ApiInfo Component', () => {
  let builder;
  beforeEachProviders(() => [
      provide(SchemaManager, {useValue: new SchemaManager()})
  ]);
  beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
    builder = tcb;
    return schemaMgr.load('/tests/schemas/api-info-test.json').then(() => null, (err) => { throw err; });
  }));


  it('shold init component data', (done) => {
    builder.createAsync(TestApp).then(fixture => {
      let apiInfoComponent = getChildDebugElement(fixture.debugElement, 'api-info').componentInstance;
      expect(apiInfoComponent).not.toBeNull();
      fixture.detectChanges();
      expect(apiInfoComponent.data).not.toBeNull();
      apiInfoComponent.data.title.should.be.equal('Swagger Petstore');
      done();
    }, err => done.fail(err));
  });

  it('shold render api name and version', (done) => {
    builder.createAsync(TestApp).then(fixture => {
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-info').nativeElement;
      let headerElement = nativeElement.querySelector('h1');
      fixture.detectChanges();
      expect(headerElement).toHaveText('Swagger Petstore (1.0.0)');
      done();
    }, err => done.fail(err));
  });
});


/** Test component that contains an MdButton. */
@Component({selector: 'test-app'})
@View({
  directives: [ApiInfo],
  providers: [SchemaManager],
  template:
      `<api-info></api-info>`
})
class TestApp {
}
