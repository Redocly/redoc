'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';
import { OptionsService, MenuItem } from '../../services/index';

import {
  inject,
  async
} from '@angular/core/testing';

import { TestBed, ComponentFixture } from '@angular/core/testing';

import { MethodsList, SideMenu } from '../index';

import { SpecManager } from '../../utils/spec-manager';

let testOptions;

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent, MethodsList ] });
  });
  describe('SideMenu Component', () => {
    let builder;
    let component: SideMenu;
    let fixture: ComponentFixture<TestAppComponent>;
    let specMgr;

    beforeEach(inject([SpecManager, OptionsService],
      (_specMgr, opts) => {

      testOptions = opts;
      testOptions.options = {
        scrollYOffset: () => 0,
        $scrollParent: window
      };
      specMgr = _specMgr;
    }));

    beforeEach(done => {
      specMgr.load('/tests/schemas/extended-petstore.yml').then(done, done.fail);
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'side-menu').componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      if (fixture) fixture.destroy();
    });

    it('should init component and component data', () => {
      should.exist(component);
    });

    it('should clear active item and cat captions on change to null', () => {
      component.activeCatCaption = 'test';
      component.activeItemCaption = 'test';
      component.changed(null);
      component.activeCatCaption.should.be.equal('');
      component.activeItemCaption.should.be.equal('');
    });

    it('should set active item and cat captions on change event', () => {
      let parentItem: MenuItem = {
        id: 'id',
        name: 'Item'
      };
      component.changed(parentItem);
      component.activeCatCaption.should.be.equal(parentItem.name);
      component.activeItemCaption.should.be.equal('');

      let childItem: MenuItem = {
        id: 'id2',
        name: 'Child',
        parent: parentItem
      };
      component.changed(childItem);
      component.activeCatCaption.should.be.equal(parentItem.name);
      component.activeItemCaption.should.be.equal(childItem.name);
    });
  });
});

/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  template:
      `<side-menu></side-menu>
      <methods-list></methods-list>`
})
class TestAppComponent {
}
