'use strict';

import { Component } from '@angular/core';
import {
  inject,
  async,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';


import { ResponsesList } from './responses-list';
import { SpecManager } from '../../utils/spec-manager';

describe('Redoc components', () => {

  describe('ResponsesList Component', () => {
    let builder;
    let component: ResponsesList;
    let fixture: ComponentFixture<ResponsesList>
    let specMgr;

    beforeEach(async(inject([SpecManager], (_specMgr) => {
      specMgr = _specMgr;
    })));

    beforeEach(done => {
      specMgr.load('/tests/schemas/responses-list-component.json').then(done, done.fail);
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(ResponsesList);
      component = fixture.componentInstance;
    });

    it('should instantiate without errors', () => {
      should.exist(component);
    });

    it('should init repsonses list', () => {
      component.pointer = '#/paths/~1test1/get/responses';
      fixture.detectChanges();
      should.exist(component.responses);
      component.responses.should.be.lengthOf(2);
    });

    it('should not overwrite codes for shared schemas', () => {
      component.pointer = '#/paths/~1test1/get/responses';
      fixture.detectChanges();
      let resp1 = component.responses[0];
      let resp2 = component.responses[1];
      resp1.code.should.not.be.equal(resp2.code);
    });

    it('should set type of default as error if other 200-399 response is defined', () => {
      component.pointer = '#/paths/~1test2/get/responses';
      fixture.detectChanges();
      let resp1 = component.responses[1];
      resp1.type.should.be.equal('error');
    });
  });
});
