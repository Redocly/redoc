'use strict';

import { getChildDebugElement } from 'tests/helpers';
import { Component, provide } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { OptionsService, RedocEventsService } from 'lib/services/index';

import {
  inject,
  async,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import { MethodsList, SideMenu } from 'lib/components/index';

import SchemaManager from 'lib/utils/SchemaManager';

let testOptions = new OptionsService();
testOptions.options = {
  scrollYOffset: () => 0,
  scrollParent: window
};

let redocEvents = new RedocEventsService();

describe('Redoc components', () => {
  describe('SideMenu Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()}),
        provide(BrowserDomAdapter, {useValue: new BrowserDomAdapter()}),
        provide(OptionsService, {useValue: testOptions}),
        provide(RedocEventsService, {useValue: redocEvents})
    ]);
    beforeEach(async(inject([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/extended-petstore.yml');
    })));

    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        component = getChildDebugElement(fixture.debugElement, 'side-menu').componentInstance;
        fixture.detectChanges();
        done();
      }, err => {
        throw err;
      });
    });

    afterEach(() => {
      if (fixture) fixture.destroy();
    });

    it('should init component and component data', () => {
      expect(component).not.toBeNull();
      expect(component.data).not.toBeNull();
    });
  });
});

/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  directives: [MethodsList, SideMenu],
  template:
      `<side-menu></side-menu>
      <methods-list></methods-list>`
})
class TestApp {
}
