'use strict';

import {RedocComponent, BaseComponent} from '../base';

/* temporarily this component uses json-schema-view-js lib */
import 'json-formatter-js/src/index';
import 'json-formatter-js/dist/style.css!';
import JSONSchemaView from 'json-schema-view-js/src/index';
import 'json-schema-view-js/dist/style.css!';

import {ElementRef} from 'angular2/angular2';
import {JsonPointer} from '../../utils/JsonPointer';

@RedocComponent({
  selector: 'schema',
  template: ''
})
export class JsonSchemaView extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
  }

  dereference(schema = this.componentSchema) {
    // simple in-place schema dereferencing. Schema is already bundled so no need in
    // global dereferencing.
    // TODO: doesn't support circular references
    if (schema && schema.$ref) {
      let resolved = this.schemaMgr.byPointer(schema.$ref);
      let baseName = JsonPointer.baseName(schema.$ref);
      // if resolved schema doesn't have title use name from ref
      resolved.title = resolved.title || baseName;
      Object.assign(schema, resolved);
      schema.$ref = null;
    }

    Object.keys(schema).forEach((key) => {
      let value = schema[key];
      if (value && typeof value === 'object') {
        this.dereference(value);
      }
    });
  }

  init() {
    this.dereference();
    const formatter = new JSONSchemaView(this.componentSchema, 1);
    this.element.appendChild(formatter.render());
  }
}

JsonSchemaView.parameters = JsonSchemaView.parameters.concat([[ElementRef]]);
