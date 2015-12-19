'use strict';

import { getChildDebugElement, getChildDebugElementAll, mouseclick } from 'tests/helpers';
import {Component, View} from 'angular2/core';

import {
  TestComponentBuilder,
  inject,
  beforeEach,
  it
} from 'angular2/testing';

import {Tabs, Tab} from 'lib/common/components/Tabs/tabs';

describe('Common components', () => {
  describe('Tabs Component', () => {
    let builder;
    let component;
    let nativeElement;
    let childDebugEls;
    let fixture;

    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        let debugEl = getChildDebugElement(fixture.debugElement, 'tabs');
        childDebugEls = getChildDebugElementAll(debugEl, 'tab');
        component = debugEl.componentInstance;
        nativeElement = debugEl.nativeElement;
        done();
      }, err => done.fail(err));
    });


    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should handle inner tabs', () => {
      component.tabs.should.have.lengthOf(2);
      childDebugEls.should.have.lengthOf(2);
    });

    it('should activate first tab by default', () => {
      let tabs = childDebugEls.map(debugEl => debugEl.componentInstance);
      let [tab1, tab2] = tabs;

      tab1.active.should.be.true;
      tab2.active.should.be.false;
    });

    it('should change active tab on click', () => {
      fixture.detectChanges();
      let headerEls = nativeElement.querySelectorAll('li');
      let tabs = childDebugEls.map(debugEl => debugEl.componentInstance);
      let [tab1, tab2] = tabs;

      mouseclick(headerEls[0]);
      tab1.active.should.be.false;
      tab2.active.should.be.true;
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({selector: 'test-app'})
@View({
  directives: [Tabs, Tab],
  template:
      `<tabs>
        <tab tabTitle="Tab1" tabStatus="test">Test</tab>
        <tab tabTitle="Tab2" tabStatus="test">Test</tab>
      </tabs>`
})
class TestApp {
}
