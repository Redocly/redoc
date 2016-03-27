'use strict';

import { getChildDebugElement, getChildDebugElementAll } from 'tests/helpers';
import {Component} from 'angular2/core';

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
    let childDebugEls;
    let debugEl;
    let fixture;
    let hostComponent;

    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        hostComponent = fixture.debugElement.componentInstance;
        debugEl = getChildDebugElement(fixture.debugElement, 'tabs');
        childDebugEls = getChildDebugElementAll(debugEl, 'tab');
        component = debugEl.componentInstance;
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

      tab1.active.should.be.true();
      tab2.active.should.be.false();
    });

    it('should change active tab on click', () => {
      fixture.detectChanges();
      //let headerEls = nativeElement.querySelectorAll('li');
      let tabs = childDebugEls.map(debugEl => debugEl.componentInstance);
      let [tab1, tab2] = tabs;

      let tabsInst = debugEl.componentInstance;
      tabsInst.selectTab(tab2);
      tab1.active.should.be.false();
      tab2.active.should.be.true();
    });

    it('should change tab by title and not emit Event', (done) => {
      fixture.detectChanges();
      let tabs = childDebugEls.map(debugEl => debugEl.componentInstance);
      let [tab1, tab2] = tabs;
      let tab2Title = 'Tab2';

      let tabsInst = debugEl.componentInstance;
      tabsInst.selectyByTitle(tab2Title);
      tab1.active.should.be.false();
      tab2.active.should.be.true();

      setTimeout(() => {
        hostComponent.eventLog.should.be.deepEqual([]);
        done();
      });
    });


    it('should emit event on tab Change', (done) => {
      fixture.detectChanges();
      let tabs = childDebugEls.map(debugEl => debugEl.componentInstance);
      let tab2 = tabs[1];
      let tabsInst = debugEl.componentInstance;
      tabsInst.selectTab(tab2, true);

      setTimeout(() => {
        hostComponent.eventLog.should.be.deepEqual(['Tab2']);
        done();
      });
    });

    it('should emit event on tab change by Title with notify true', (done) => {
      fixture.detectChanges();
      let tab2Title = 'Tab2';

      let tabsInst = debugEl.componentInstance;
      tabsInst.selectyByTitle(tab2Title, true);

      setTimeout(() => {
        hostComponent.eventLog.should.be.deepEqual(['Tab2']);
        done();
      });
    });

    it('should not emit event on tab change with notify false', (done) => {
      fixture.detectChanges();
      let tabs = childDebugEls.map(debugEl => debugEl.componentInstance);
      let tab2 = tabs[1];
      let tabsInst = debugEl.componentInstance;
      tabsInst.selectTab(tab2, false);

      setTimeout(() => {
        hostComponent.eventLog.should.be.deepEqual([]);
        done();
      });
    });

    it('should leave current tab active if selectyByTitle non existing title', () => {
      fixture.detectChanges();
      let tabs = childDebugEls.map(debugEl => debugEl.componentInstance);
      let [tab1, tab2] = tabs;

      let tabsInst = debugEl.componentInstance;
      tabsInst.selectyByTitle('badTitle');
      tab1.active.should.be.true();
      tab2.active.should.be.false();
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  directives: [Tabs, Tab],
  template:
      `<tabs (change)="onEvent($event)">
        <tab tabTitle="Tab1" tabStatus="test">Test</tab>
        <tab tabTitle="Tab2" tabStatus="test">Test</tab>
      </tabs>`
})
class TestApp {
  constructor() {
    this.eventLog = [];
  }
  onEvent(event) {
    this.eventLog.push(event);
  }
}
