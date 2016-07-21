'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';
import { OptionsService } from '../../services/index';

import {
  inject,
  async
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import { MethodsList, SideMenu } from '../index';

import { SpecManager } from '../../utils/SpecManager';;

let testOptions;

describe('Redoc components', () => {
  describe('SideMenu Component', () => {
    let builder;
    let component;
    let fixture;

    beforeEach(async(inject([TestComponentBuilder, SpecManager, OptionsService],
      (tcb, specMgr, opts) => {
      builder = tcb;
      testOptions = opts;
      testOptions.options = {
        scrollYOffset: () => 0,
        $scrollParent: window
      };
      return specMgr.load('/tests/schemas/extended-petstore.yml');
    })));

    beforeEach(() => {
      fixture = builder.createSync(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'side-menu').componentInstance;
      fixture.detectChanges();
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
class TestAppComponent {
}
