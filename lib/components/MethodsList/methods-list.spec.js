'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, provide} from '@angular/core';
import OptionsManager from 'lib/options';
import {BrowserDomAdapter} from '@angular/platform-browser/src/browser/browser_adapter';

import {
  inject,
  async,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import MethodsList from 'lib/components/MethodsList/methods-list';
import SchemaManager from 'lib/utils/SchemaManager';

describe('Redoc components', () => {
  describe('MethodsList Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()}),
        provide(OptionsManager, {useClass: OptionsManager}),
        provide(BrowserDomAdapter, {useClass: BrowserDomAdapter})
    ]);
    beforeEach(async(inject([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/methods-list-component.json');
    })));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
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
      component.data.tags[0].methods.should.be.empty;
      component.data.tags[1].name.should.be.equal('tag1');
      component.data.tags[1].methods.should.have.lengthOf(2);
    });
  });
});

/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  directives: [MethodsList],
  providers: [SchemaManager],
  template:
      `<methods-list></methods-list>`
})
class TestApp {
}
