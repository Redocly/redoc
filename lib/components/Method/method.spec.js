'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, provide} from '@angular/core';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';

import {
  TestComponentBuilder,
  async,
  inject,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/testing';

import Method from 'lib/components/Method/method';
import SchemaManager from 'lib/utils/SchemaManager';
import OptionsManager from 'lib/options';

describe('Redoc components', () => {
  describe('Method Component', () => {
    let builder;
    let component;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()}),
        provide(BrowserDomAdapter, {useClass: BrowserDomAdapter}),
        provide(OptionsManager, {useClass: OptionsManager})
    ]);
    beforeEach(async(inject([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/extended-petstore.yml');
    })));
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
@Component({
  selector: 'test-app',
  directives: [Method],
  providers: [SchemaManager],
  template:
      `<method pointer='#/paths/~1user~1{username}/put'></method>`
})
class TestApp {
}
