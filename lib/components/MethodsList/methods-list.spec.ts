'use strict';

import { Component, provide } from '@angular/core';
import {
  inject,
  async,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';

import { getChildDebugElement } from '../../../tests/helpers';


import { MethodsList } from './methods-list';
import { SchemaManager } from '../../utils/SchemaManager';

describe('Redoc components', () => {
  describe('MethodsList Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()})
    ]);
    beforeEach(async(inject([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/methods-list-component.json');
    })));
    beforeEach((done) => {
      builder.createAsync(TestAppComponent).then(_fixture => {
        fixture = _fixture;
        component = getChildDebugElement(fixture.debugElement, 'methods-list').componentInstance;
        fixture.detectChanges();
        done();
      }, err => done.fail(err) );
    });


    it('should init component and component data', () => {
      expect(component).not.toBeNull();
    });

    it('should get correct tags list', () => {
      expect(component.data.tags).not.toBeNull();
      component.data.tags.should.have.lengthOf(2);
      component.data.tags[0].name.should.be.equal('traitTag');
      component.data.tags[0].methods.should.be.empty();
      component.data.tags[1].name.should.be.equal('tag1');
      component.data.tags[1].methods.should.have.lengthOf(2);
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
