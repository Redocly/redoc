'use strict';

import {RedocComponent, BaseComponent} from '../base';

/* temporarily this component uses json-schema-view-js lib */
import 'json-formatter-js/src/index';
import 'json-formatter-js/dist/style.css!';
import JSONSchemaView from 'json-schema-view-js/src/index';
import 'json-schema-view-js/dist/style.css!';

import {ElementRef} from 'angular2/angular2';

@RedocComponent({
  selector: 'schema',
  template: ''
})
export class JsonSchemaView extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
  }

  init() {
    this.dereference();
    const formatter = new JSONSchemaView(this.componentSchema, 1);
    this.element.appendChild(formatter.render());
  }
}

JsonSchemaView.parameters = JsonSchemaView.parameters.concat([[ElementRef]]);
