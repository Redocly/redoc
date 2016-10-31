'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';

import {
  inject,
  async
} from '@angular/core/testing';

import { TestBed } from '@angular/core/testing';

import { Redoc } from './redoc';
import { SpecManager } from '../../utils/spec-manager';
import { OptionsService } from '../../services/index';

let optsMgr:OptionsService;

describe('Redoc components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
  });
  describe('Redoc Component', () => {
    let builder;
    let specMgr;

    beforeEach(async(inject([SpecManager, OptionsService],
      ( _specMgr, _optsMgr) => {
      optsMgr = _optsMgr;

      specMgr = _specMgr;
      return specMgr.load('/tests/schemas/extended-petstore.yml');
    })));


    it('should init component', () => {
      let fixture = TestBed.createComponent(TestAppComponent);
      let component = getChildDebugElement(fixture.debugElement, 'redoc').componentInstance;
      expect(component).not.toBeNull();
      fixture.destroy();
    });

    it('should init components tree without errors', () => {
      let fixture = TestBed.createComponent(TestAppComponent);
      (() => fixture.detectChanges()).should.not.throw();
      fixture.destroy();
    });
  });
});

/** Test component that contains a Redoc. */
@Component({
  selector: 'test-app',
  template:
      `<redoc disable-lazy-schemas></redoc>`
})
class TestAppComponent {
}
