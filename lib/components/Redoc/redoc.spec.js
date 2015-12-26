'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, View, provide} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';

import {
  TestComponentBuilder,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  it
} from 'angular2/testing';

import Redoc from 'lib/components/Redoc/redoc';
import SchemaManager from 'lib/utils/SchemaManager';

describe('Redoc components', () => {
  describe('Redoc Component', () => {
    let builder;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()}),
        provide(BrowserDomAdapter, {useValue: new BrowserDomAdapter()})
    ]);
    beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/extended-petstore.json').then(() => null, (err) => { throw err; });
    }));


    it('should init component', (done) => {
      builder.createAsync(TestApp).then(fixture => {
        let component = getChildDebugElement(fixture.debugElement, 'redoc').componentInstance;
        expect(component).not.toBeNull();
        fixture.destroy();
        done();
      }, err => done.fail(err));
    });

    it('should init components tree without errors', (done) => {
      builder.createAsync(TestApp).then(fixture => {
        (() => fixture.detectChanges()).should.not.throw();
        fixture.destroy();
        done();
      }, err => done.fail(err));
    });

    it('should parse component options from host element', (done) => {
      builder.createAsync(TestApp).then(fixture => {
        let component = getChildDebugElement(fixture.debugElement, 'redoc').componentInstance;
        fixture.detectChanges();
        console.log(component.options.scrollOffsetTop);
        component.options.scrollOffsetTop.should.be.equal(50);
        fixture.destroy();
        done();
      }, err => done.fail(err));
    });
  });
});

/** Test component that contains a Redoc. */
@Component({selector: 'test-app'})
@View({
  directives: [Redoc],
  template:
      `<redoc scroll-y-offset="50"></redoc>`
})
class TestApp {
}
