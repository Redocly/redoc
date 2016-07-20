'use strict';

import { Component } from '@angular/core';
import {
  inject,
  async,
  TestComponentBuilder
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';


import { MethodsList } from './methods-list';
import { SpecManager } from '../../utils/SpecManager';

describe('Redoc components', () => {
  describe('MethodsList Component', () => {
    let builder;
    let component;
    let fixture;

    beforeEach(async(inject([TestComponentBuilder, SpecManager], (tcb, specMgr) => {
      builder = tcb;
      return specMgr.load('/tests/schemas/methods-list-component.json');
    })));
    beforeEach(() => {
      fixture = builder.createSync(TestAppComponent);
      component = getChildDebugElement(fixture.debugElement, 'methods-list').componentInstance;
      fixture.detectChanges();
    });


    it('should init component and component data', () => {
      expect(component).not.toBeNull();
    });

    it('should get correct tags list', () => {
      expect(component.tags).not.toBeNull();
      component.tags.should.have.lengthOf(2);
      component.tags[0].name.should.be.equal('traitTag');
      component.tags[0].methods.should.be.empty();
      component.tags[1].name.should.be.equal('tag1');
      component.tags[1].methods.should.have.lengthOf(2);
    });
  });
});

@Component({
  selector: 'test-app',
  directives: [ MethodsList ],
  template:
      `<methods-list></methods-list>`
})
class TestAppComponent {
}
