'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';

import {
  inject,
  async,
  TestComponentBuilder
} from '@angular/core/testing';

import { ApiLogo } from './api-logo';
import { SpecManager } from '../../utils/SpecManager';


describe('Redoc components', () => {
  describe('ApiLogo Component', () => {
    let builder;
    let component;
    let fixture;
    let specMgr;

    let schemaUrl = '/tests/schemas/api-info-test.json';
    beforeEach(async(inject([TestComponentBuilder, SpecManager], (tcb, _specMgr) => {
      builder = tcb;
      specMgr = _specMgr;
      return specMgr.load(schemaUrl);
    })));
    beforeEach(() => {
      fixture = builder.createSync(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'api-logo').componentInstance;
      fixture.detectChanges();
    });


    it('should init component data', () => {
      expect(component).not.toBeNull();
      expect(component.data).not.toBeNull();
    });

    it('should not display image when no x-logo', () => {
      component.data.should.be.empty();
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-logo').nativeElement;
      let imgElement = nativeElement.querySelector('img');
      expect(imgElement).toBeNull();

      // update schemaUrl to load other schema in the next test
      schemaUrl = '/tests/schemas/extended-petstore.yml';
    });

    it('should load values from spec and use transparent bgColor by default', () => {
      component.data.imgUrl.should.endWith('petstore-logo.png');
      component.data.bgColor.should.be.equal('transparent');
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  directives: [ApiLogo],
  providers: [SpecManager],
  template:
      `<api-logo></api-logo>`
})
class TestAppComponent {
}
