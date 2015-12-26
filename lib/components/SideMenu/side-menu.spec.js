'use strict';

import { getChildDebugElement, mouseclick} from 'tests/helpers';
import {Component, View, provide, ViewMetadata} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';

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
import Redoc from 'lib/components/Redoc/redoc';
import SchemaManager from 'lib/utils/SchemaManager';

let _mockRedoc = {
  options: {
    scrollOffsetTop: 0,
    scrollParent: window
  }
};
describe('Redoc components', () => {
  describe('SideMenu Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()}),
        provide(BrowserDomAdapter, {useValue: new BrowserDomAdapter()}),
        provide(Redoc, {useValue: _mockRedoc})
    ]);
    beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/extended-petstore.json').then(() => null, (err) => { throw err; });
    }));

    afterEach(() => {
      if (fixture) fixture.destroy();
    });

    describe('window parent case', () => {
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

      it('should init component and component data', () => {
        expect(component).not.toBeNull();
        expect(component.data).not.toBeNull();
      });

      it('should run hashScroll when redoc bootstrapped', (done) => {
        spyOn(component.adapter, 'getLocation').and.returnValue({hash: ''});
        spyOn(component, 'hashScroll').and.stub();
        spyOn(window, 'scrollTo').and.stub();
        redocEvents.bootstrapped.next();
        setTimeout(() => {
          expect(component.hashScroll).toHaveBeenCalled();
          expect(window.scrollTo).not.toHaveBeenCalled();

          window.scrollTo.and.callThrough();
          component.hashScroll.and.callThrough();
          done();
        });
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

    describe('scollable div parent case', () => {
      let menuNativeEl;
      beforeEach((done) => {
        let scollableDivTmpl =
          `<div style="height: 500px; overflow-y: auto;">
            <side-menu></side-menu>
            <methods-list></methods-list>
          </div>`;
        builder = builder.overrideView(
          TestApp, new ViewMetadata({template: scollableDivTmpl, directives: [MethodsList, SideMenu]}));

        builder.createAsync(TestApp).then(_fixture => {
          fixture = _fixture;
          component = getChildDebugElement(fixture.debugElement, 'side-menu').componentInstance;
          menuNativeEl = getChildDebugElement(fixture.debugElement, 'side-menu').nativeElement;
          component.scrollParent = _fixture.nativeElement.children[0];
          fixture.detectChanges();

          done();
        }, err => {
          throw err;
        });
      });



      it('should init component and component data', () => {
        expect(component).not.toBeNull();
        expect(component.data).not.toBeNull();
      });

      it('should scroll to method when location hash is present', (done) => {
        let hash = '#pet/paths/~1pet~1findByStatus/get';
        spyOn(component.adapter, 'getLocation').and.returnValue({hash: hash});
        spyOn(component, 'hashScroll').and.callThrough();
        redocEvents.bootstrapped.next();
        setTimeout(() => {
          expect(component.hashScroll).toHaveBeenCalled();
          expect(component.scrollParent.scrollTop).toBeGreaterThan(0);
          done();
        });
      });

      it('should select next/prev menu item when scrolled down/up', () => {
        component.activeCatIdx.should.be.equal(0);
        component.activeMethodIdx.should.be.equal(-1);
        let elTop = component.getCurrentMethodEl().getBoundingClientRect().bottom;

        component.scrollParent.scrollTop = elTop + 1;
        //simulate scroll down
        spyOn(component, 'scrollY').and.returnValue(elTop + 2);
        component.scrollHandler();
        component.activeCatIdx.should.be.equal(1);


        component.scrollParent.scrollTop = elTop - 1;
        //simulate scroll up
        component.scrollY.and.returnValue(elTop - 2);
        component.scrollHandler();
        component.activeCatIdx.should.be.equal(0);
      });

      it('should activate menu item on click', () => {
        let menuItemEl = menuNativeEl.querySelector('li');
        expect(menuItemEl).not.toHaveCssClass('active');
        mouseclick(menuItemEl);
        fixture.detectChanges();
        expect(menuItemEl).toHaveCssClass('active');
      });

      it('should scroll to appropriate element when click on menu label', () => {
        component.scrollParent.scrollTop.should.be.equal(0);
        let menuItemEl = menuNativeEl.querySelector('li');
        mouseclick(menuItemEl);
        component.scrollParent.scrollTop.should.be.above(0);
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
