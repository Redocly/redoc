'use strict';

import { getChildDebugElement, mouseclick } from '../../../../tests/helpers';

import { Component } from '@angular/core';
import {
  inject,
  TestBed
} from '@angular/core/testing';

import { Zippy } from '../index';

describe('Common components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestApp ] });
  });
  describe('Zippy Component', () => {
    let builder;
    let component: Zippy;
    let nativeElement;
    let fixture;

    beforeEach(() => {
      fixture = TestBed.createComponent(TestApp);
      let debugEl = getChildDebugElement(fixture.debugElement, 'zippy');
      component = debugEl.componentInstance;
      nativeElement = debugEl.nativeElement;
    });

    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should init component defaults', () => {
      component.empty.should.be.false();
      component.open.should.be.false();
      component.type.should.be.equal('general');
    });

    it('should init properties from dom params', () => {
      fixture.detectChanges();
      component.open.should.be.true();
      component.empty.should.be.true();
      component.title.should.be.equal('Zippy');
      component.type.should.be.equal('test');
    });

    it('project inner content', () => {
      fixture.detectChanges();
      let contentEl = nativeElement.querySelector('.zippy-content');
      expect(contentEl.innerText).toMatch('test');
    });

    it('should open and close zippy', (done) => {
      fixture.detectChanges();
      component.empty = false;
      component.open = true;
      fixture.detectChanges();

      let testComponent = fixture.debugElement.componentInstance;

      let titleEl = nativeElement.querySelector('.zippy-title');
      mouseclick(titleEl);
      fixture.detectChanges();
      component.open.should.be.false();
      testComponent.opened.should.be.false();

      mouseclick(titleEl);
      fixture.detectChanges();
      setTimeout(() => {
        component.open.should.be.true();
        testComponent.opened.should.be.true();
        testComponent.clickCount.should.be.equal(2);
        done();
      });
    });

    it('should disable empty zippy', () => {
      fixture.detectChanges();
      component.empty = true;
      fixture.detectChanges();

      let testComponent = fixture.debugElement.componentInstance;

      let titleEl = nativeElement.querySelector('.zippy-title');
      mouseclick(titleEl);
      fixture.detectChanges();
      testComponent.clickCount.should.be.equal(0);
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  template:
      `<zippy title="Zippy" type="test" [open]="true" [empty]="true" (openChange)="open($event)">test</zippy>`
})
class TestApp {
  opened: boolean;
  clickCount: number;
  constructor() {
    this.opened = false;
    this.clickCount = -1; // initial change detection
  }
  open(val) {
    this.opened = val;
    this.clickCount++;
  }
}
