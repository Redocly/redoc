'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, View, provide} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser';

import {
  TestComponentBuilder,
  inject,
  beforeEach,
  beforeEachProviders,
  it
} from 'angular2/testing';

import StickySidebar from 'lib/common/components/StickySidebar/sticky-sidebar';

describe('Common components', () => {
  describe('StickySidebar Component', () => {
    let builder;
    let component;
    let fixture;

    beforeEachProviders(() => [
      provide(BrowserDomAdapter, {useValue: new BrowserDomAdapter()})
    ]);
    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        let debugEl = getChildDebugElement(fixture.debugElement, 'sticky-sidebar');
        component = debugEl.componentInstance;
        done();
      }, err => done.fail(err));
    });


    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should start unsticked', () => {
      spyOn(component, 'stick').and.callThrough();
      fixture.detectChanges();
      expect(component.stick).not.toHaveBeenCalled();
    });

    it('should stick if scrolled more than scrollYOffset', () => {
      spyOn(component, 'stick').and.callThrough();
      fixture.detectChanges();
      window.scrollY = 40;
      component.updatePosition();
      expect(component.stick).toHaveBeenCalled();
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({selector: 'test-app'})
@View({
  directives: [StickySidebar],
  template:
      `<div style="padding-top: 20px">
        <div style="height: 20px; position: fixed; top: 0;"> </div>
        <div style="position: relative">
          <sticky-sidebar [scrollParent]="scrollParent" [scrollYOffset]="options.scrollYOffset">
          </sticky-sidebar>
        </div>
      </div>`

})
class TestApp {
  constructor() {
    this.options = {};
    this.scrollParent = window;
    this.options.scrollYOffset = () => 20;
  }
}
