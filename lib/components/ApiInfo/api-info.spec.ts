'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';
import { OptionsService } from '../../services/index';

import {
  inject,
  async,
  TestBed
} from '@angular/core/testing';

import { SpecManager } from '../../utils/spec-manager';

describe('Redoc components', () => {
  describe('ApiInfo Component', () => {
    let component;
    let fixture;
    let opts;
    let specMgr;
    beforeEach(() => {
      TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
    });
    beforeEach(async(inject([SpecManager, OptionsService], (_specMgr, _opts) => {
      opts = _opts;
      opts.options = {
        scrollYOffset: () => 0,
        $scrollParent: window
      };
      specMgr = _specMgr;
    })));

    beforeEach(done => {
      specMgr.load('/tests/schemas/api-info-test.json').then(done, done.fail);
    });

    beforeEach(async(() => {
      fixture = TestBed.createComponent(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'api-info').componentInstance;
      fixture.detectChanges();
    }));


    it('should init component data', () => {
      expect(component).not.toBeNull();
      expect(component.info).not.toBeNull();
      component.info.title.should.be.equal('Swagger Petstore');
    });

    it('should render api name and version', () => {
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-info').nativeElement;
      let headerElement = nativeElement.querySelector('h1');
      expect(headerElement.innerText).toContain('Swagger Petstore (v1.0.0)');
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  template:
      `<api-info></api-info>`
})
class TestAppComponent {
}
