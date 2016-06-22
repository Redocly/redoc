'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component, provide } from '@angular/core';

import {
  inject,
  async,
  expect,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import { ApiInfo } from './api-info';
import { SpecManager } from '../../utils/SpecManager';
import { OptionsService } from '../../services/index';

describe('Redoc components', () => {
  describe('ApiInfo Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SpecManager, {useValue: new SpecManager()}),
        provide(OptionsService, {useClass: OptionsService})
    ]);

    beforeEach(async(inject([TestComponentBuilder, SpecManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/api-info-test.json');
    })));

    beforeEach((done) => {
      builder.createAsync(TestAppComponent).then(_fixture => {
        fixture = _fixture;
        component = getChildDebugElement(fixture.debugElement, 'api-info').componentInstance;
        fixture.detectChanges();
        done();
      }, err => {
        done.fail(err);
      });
    });


    it('should init component data', () => {
      expect(component).not.toBeNull();
      expect(component.data).not.toBeNull();
      component.data.title.should.be.equal('Swagger Petstore');
    });

    it('should render api name and version', () => {
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-info').nativeElement;
      let headerElement = nativeElement.querySelector('h1');
      expect(headerElement).toHaveText('Swagger Petstore (1.0.0)');
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
