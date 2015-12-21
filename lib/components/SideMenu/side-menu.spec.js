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

import {redocEvents} from 'lib/events';
import MethodsList from 'lib/components/MethodsList/methods-list';
import SideMenu from 'lib/components/SideMenu/side-menu';
import SchemaManager from 'lib/utils/SchemaManager';

describe('Redoc components', () => {
  describe('SideMenu Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()})
    ]);
    beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/extended-petstore.json').then(() => null, (err) => { throw err; });
    }));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        component = getChildDebugElement(fixture.debugElement, 'side-menu').componentInstance;
        fixture.detectChanges();
        done();
      }, err => {
        throw err;
      });
    });

    afterEach(() => {
      if (fixture) fixture.destroy();
    });

    it('should init component and component data', () => {
      expect(component).not.toBeNull();
      expect(component.data).not.toBeNull();
    });

    it('should scroll to method when location hash is present', (done) => {
      let hash = '#pet/paths/~1pet~1findByStatus/get';
      spyOn(component.adapter, 'getLocation').and.returnValue({hash: hash});
      spyOn(component, 'hashScroll').and.callThrough();
      spyOn(window, 'scrollTo').and.stub();
      redocEvents.bootstrapped.next();
      setTimeout(() => {
        expect(component.hashScroll).toHaveBeenCalled();
        let scrollY = window.scrollTo.calls.argsFor(0)[1];
        expect(scrollY).toBeGreaterThan(0);
        done();
      });
    });
  });
});

/** Test component that contains an ApiInfo. */
@Component({selector: 'test-app'})
@View({
  directives: [MethodsList, SideMenu],
  providers: [SchemaManager],
  template:
      `<side-menu></side-menu>
      <methods-list></methods-list>`
})
class TestApp {
}
