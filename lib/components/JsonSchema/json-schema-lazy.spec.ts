'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import { Component } from '@angular/core';

import {
  inject,
  TestComponentBuilder
} from '@angular/core/testing';

import { JsonSchemaLazy } from './json-schema-lazy';

describe('Redoc components', () => {
  describe('JsonSchemaLazy Component', () => {
    let builder;
    let component;
    let fixture;

    beforeEach(inject([TestComponentBuilder], (tcb) => {
      builder = tcb;
    }));
    beforeEach(() => {
      fixture = builder.createSync(TestAppComponent);
      let debugEl = getChildDebugElement(fixture.debugElement, 'json-schema-lazy');
      component = <JsonSchemaLazy>debugEl.componentInstance;
      spyOn(component, '_loadAfterSelf').and.callThrough();
      spyOn(component.resolver, 'resolveComponent').and.returnValue({ then: () => {
        return { catch: () => {/**/} };
      }});
    });

    afterEach(() => {
      component._loadAfterSelf.and.callThrough();
      component.resolver.resolveComponent.and.callThrough();
    });

    it('should init component', () => {
      expect(component).not.toBeNull();
    });

    it('should run loadNextToLocation on load', () => {
      component.pointer = '#/def';
      fixture.detectChanges();
      component.load();
      expect(component._loadAfterSelf).toHaveBeenCalled();
    });

    it('should not run loadNextToLocation if already loaded', () => {
      component.pointer = '#/def';
      fixture.detectChanges();
      component.load();
      component.load();
      expect(component._loadAfterSelf.calls.count()).toEqual(1);
    });
  });
});


/** Test component that contains a Method. */
@Component({
  selector: 'test-app',
  directives: [JsonSchemaLazy],
  template:
      `<json-schema-lazy></json-schema-lazy>`
})
class TestAppComponent {
}
