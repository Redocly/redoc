'use strict';

import { getChildDebugElementByType } from 'tests/helpers';
import {Component, provide} from '@angular/core';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';

import {
  TestComponentBuilder,
  inject,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/testing';

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
        let debugEl = getChildDebugElementByType(fixture.debugElement, StickySidebar);
        component = debugEl.injector.get(StickySidebar);
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
      component.scrollParent = {
        pageYOffset: 40
      };
      component.updatePosition();
      expect(component.stick).toHaveBeenCalled();
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  directives: [StickySidebar],
  template:
      `<div style="padding-top: 20px">
        <div style="height: 20px; position: fixed; top: 0;"> </div>
        <div style="position: relative">
          <div sticky-sidebar [scrollParent]="scrollParent" [scrollYOffset]="options.scrollYOffset">
          </div>
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
