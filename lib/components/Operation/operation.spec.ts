'use strict';

import { Component } from '@angular/core';
import {
  inject,
  async,
  TestBed
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';

import { Operation } from './operation';
import { SpecManager } from '../../utils/spec-manager';;
import { LazyTasksService } from '../../shared/components/LazyFor/lazy-for';;

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
  });
  describe('Operation Component', () => {
    let builder;
    let component: Operation;
    let specMgr;

    beforeEach(async(inject([SpecManager, LazyTasksService], (_specMgr, lazyTasks) => {
      lazyTasks.sync = true;
      specMgr = _specMgr;
    })));

    beforeEach(done => {
      specMgr.load('/tests/schemas/extended-petstore.yml').then(done, done.fail);
    });

    beforeEach(() => {
      let fixture = TestBed.createComponent(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'operation').componentInstance;
      fixture.detectChanges();
    });


    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should init basic component data', () => {
      component.operation.verb.should.be.equal('put');
      component.operation.path.should.be.equal('/user/{username}');
    });


    it('should main tag', () => {
      component.operation.info.tags.should.be.empty();
    });
  });
});


/** Test component that contains a Operation. */
@Component({
  selector: 'test-app',
  template:
      `<operation pointer='#/paths/~1user~1{username}/put'></operation>`
})
class TestAppComponent {
}
