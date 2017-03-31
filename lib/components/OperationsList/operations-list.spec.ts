'use strict';

import { Component } from '@angular/core';
import {
  inject,
  async,
  TestBed
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';


import { OperationsList } from './operations-list';
import { SpecManager } from '../../utils/spec-manager';

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
  });
  describe('OperationsList Component', () => {
    let builder;
    let component;
    let fixture;
    let specMgr;

    beforeEach(async(inject([SpecManager], (_specMgr) => {
      specMgr = _specMgr;
    })));

    beforeEach(done => {
      specMgr.load('/tests/schemas/operations-list-component.json').then(done, done.fail);
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'operations-list').componentInstance;
      fixture.detectChanges();
    });


    it('should init component and component data', () => {
      expect(component).not.toBeNull();
    });

    it('should build correct tags list', () => {
      expect(component.tags).not.toBeNull();
      component.tags.should.have.lengthOf(2);
      component.tags[0].name.should.be.equal('traitTag');
      should.not.exist(component.tags[0].items);
      component.tags[1].name.should.be.equal('tag1');
      component.tags[1].items.should.have.lengthOf(2);
    });
  });
});

@Component({
  selector: 'test-app',
  template:
      `<operations-list></operations-list>`
})
class TestAppComponent {
}
