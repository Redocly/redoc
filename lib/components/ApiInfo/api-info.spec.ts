'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';

import {
  inject,
  async,
  TestComponentBuilder
} from '@angular/core/testing';

import { ApiInfo } from './api-info';
import { SpecManager } from '../../utils/SpecManager';

describe('Redoc components', () => {
  describe('ApiInfo Component', () => {
    let builder;
    let component;
    let fixture;

    beforeEach(async(inject([TestComponentBuilder, SpecManager], (tcb, specMgr) => {
      builder = tcb;
      return specMgr.load('/tests/schemas/api-info-test.json');
    })));

    beforeEach(() => {
      fixture = builder.createSync(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'api-info').componentInstance;
      fixture.detectChanges();
    });


    it('should init component data', () => {
      expect(component).not.toBeNull();
      expect(component.data).not.toBeNull();
      component.data.title.should.be.equal('Swagger Petstore');
    });

    it('should render api name and version', () => {
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-info').nativeElement;
      let headerElement = nativeElement.querySelector('h1');
      expect(headerElement.innerText).toContain('Swagger Petstore (1.0.0)');
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  directives: [ApiInfo],
  template:
      `<api-info></api-info>`
})
class TestAppComponent {
}
