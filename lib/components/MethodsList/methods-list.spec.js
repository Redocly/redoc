'use strict';

import { getChildDebugElement } from 'tests/helpers';
import {Component, View, provide} from 'angular2/core';

import {
  TestComponentBuilder,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  it
} from 'angular2/testing';

import MethodsList from 'lib/components/MethodsList/methods-list';
import SchemaManager from 'lib/utils/SchemaManager';

describe('Redoc components', () => {
  describe('ApiInfo Component', () => {
    let builder;
    let component;
    let fixture;
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()})
    ]);
    beforeEach(injectAsync([TestComponentBuilder, SchemaManager], (tcb, schemaMgr) => {
      builder = tcb;
      return schemaMgr.load('/tests/schemas/methods-list-component.json').then(() => null, (err) => { throw err; });
    }));
    beforeEach((done) => {
      builder.createAsync(TestApp).then(_fixture => {
        fixture = _fixture;
        component = getChildDebugElement(fixture.debugElement, 'methods-list').componentInstance;
        fixture.detectChanges();
        done();
      }, err => { throw err; });
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
@Component({selector: 'test-app'})
@View({
  directives: [MethodsList],
  providers: [SchemaManager],
  template:
      `<methods-list></methods-list>`
})
class TestApp {
}
