'use strict';

import { Component } from '@angular/core';
import {
  inject,
  async,
  TestComponentBuilder
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';

import { Method } from './method';
import { SpecManager } from '../../utils/SpecManager';;

describe('Redoc components', () => {
  describe('Method Component', () => {
    let builder;
    let component;

    beforeEach(async(inject([TestComponentBuilder, SpecManager], (tcb, specMgr) => {
      builder = tcb;
      return specMgr.load('/tests/schemas/extended-petstore.yml');
    })));

    beforeEach(() => {
      let fixture = builder.createSync(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'method').componentInstance;
      fixture.detectChanges();
    });


    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should init basic component data', () => {
      component.data.apiUrl.should.be.equal('http://petstore.swagger.io/v2');
      component.data.httpMethod.should.be.equal('put');
      component.data.path.should.be.equal('/user/{username}');
    });


    it('should main tag', () => {
      component.data.methodInfo.tags.should.be.empty();
    });
  });
});


/** Test component that contains a Method. */
@Component({
  selector: 'test-app',
  directives: [Method],
  providers: [SpecManager],
  template:
      `<method pointer='#/paths/~1user~1{username}/put'></method>`
})
class TestAppComponent {
}
