'use strict';

import { Component } from '@angular/core';
import {
  inject,
  async,
  TestBed
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';


import { MethodsList } from './methods-list';
import { SpecManager } from '../../utils/spec-manager';

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
  });
  describe('MethodsList Component', () => {
    let builder;
    let component;
    let fixture;

    beforeEach(async(inject([SpecManager], ( specMgr) => {

      return specMgr.load('/tests/schemas/methods-list-component.json');
    })));
    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'methods-list').componentInstance;
      fixture.detectChanges();
    });


    it('should init component and component data', () => {
      expect(component).not.toBeNull();
    });

    it('should get correct tags list', () => {
      expect(component.tags).not.toBeNull();
      component.tags.should.have.lengthOf(2);
      component.tags[0].name.should.be.equal('traitTag');
      component.tags[0].methods.should.be.empty();
      component.tags[1].name.should.be.equal('tag1');
      component.tags[1].methods.should.have.lengthOf(2);
    });
  });
});

@Component({
  selector: 'test-app',
  template:
      `<methods-list></methods-list>`
})
class TestAppComponent {
}
