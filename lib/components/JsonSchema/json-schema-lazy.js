'use strict';

import {Component, View, ElementRef} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import JsonSchema from './json-schema';
import {DynamicComponentLoader} from 'angular2/src/core/linker/dynamic_component_loader';
import OptionsManager from '../../options';

@Component({
  selector: 'json-schema-lazy',
  inputs: ['pointer']
})
@View({
  template: '',
  directives: [CORE_DIRECTIVES]
})
export default class JsonSchemaLazy {

  constructor(elementRef, dcl) {
    this.elementRef = elementRef;
    this.dcl = dcl;
  }

  load() {
    if (OptionsManager.instance().options.disableLazySchemas) return;
    if (this.loaded) return;
    if (this.pointer) {
      this.dcl.loadNextToLocation(JsonSchema, this.elementRef).then((compRef) => {
        compRef.instance.pointer = this.pointer;
      });
    }
    this.loaded = true;
  }
}
JsonSchemaLazy.parameters = [[ElementRef], [DynamicComponentLoader]];
