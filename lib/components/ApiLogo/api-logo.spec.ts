'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';

import {
  inject,
  async,
  TestBed
} from '@angular/core/testing';

import { ApiLogo } from './api-logo';
import { SpecManager } from '../../utils/spec-manager';


describe('Redoc components', () => {
  describe('ApiLogo Component', () => {
    let builder;
    let component;
    let fixture;
    let specMgr;

    let schemaUrl = '/tests/schemas/api-info-test.json';
    beforeEach(() => {
      TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
    });

    beforeEach(async(inject([SpecManager], ( _specMgr) => {
      specMgr = _specMgr;
    })));

    beforeEach(done => {
      specMgr.load(schemaUrl).then(done, done.fail);
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'api-logo').componentInstance;
      fixture.detectChanges();
    });


    it('should init component data', () => {
      if (specMgr.a) return;
      expect(component).not.toBeNull();
      expect(component.logo).not.toBeNull();
    });

    it('should not display image when no x-logo', () => {
      component.logo.should.be.empty();
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-logo').nativeElement;
      let imgElement = nativeElement.querySelector('img');
      expect(imgElement).toBeNull();

      // update schemaUrl to load other schema in the next test
      schemaUrl = '/tests/schemas/extended-petstore.yml';
    });

    it('should load values from spec and use transparent bgColor by default', () => {
      component.logo.imgUrl.should.endWith('petstore-logo.png');
      component.logo.bgColor.should.be.equal('transparent');
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  template:
      `<api-logo></api-logo>`
})
class TestAppComponent {
}
