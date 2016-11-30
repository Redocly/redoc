'use strict';

import { Component } from '@angular/core';
import {
  inject,
  async,
  TestBed
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';

import { Method } from './method';
import { SpecManager } from '../../utils/spec-manager';;
import { LazyTasksService } from '../../shared/components/LazyFor/lazy-for';;

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
  });
  describe('Method Component', () => {
    let builder;
    let component;
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
      component = getChildDebugElement(fixture.debugElement, 'method').componentInstance;
      fixture.detectChanges();
    });


    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should init basic component data', () => {
      component.method.apiUrl.should.be.equal('http://petstore.swagger.io/v2');
      component.method.httpMethod.should.be.equal('put');
      component.method.path.should.be.equal('/user/{username}');
    });


    it('should main tag', () => {
      component.method.info.tags.should.be.empty();
    });
  });
});


/** Test component that contains a Method. */
@Component({
  selector: 'test-app',
  template:
      `<method pointer='#/paths/~1user~1{username}/put'></method>`
})
class TestAppComponent {
}
