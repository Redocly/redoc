'use strict';

import {RedocComponent, BaseComponent} from '../base';

import SchemaSampler from 'json-schema-instantiator';

import {JsonFormatter} from '../../utils/JsonFormatterPipe';
import {ElementRef} from 'angular2/core';

@RedocComponent({
  selector: 'schema-sample',
  templateUrl: './lib/components/SchemaSample/schema-sample.html',
  pipes: [JsonFormatter],
  styleUrls: ['./lib/components/SchemaSample/schema-sample.css']
})
export default class SchemaSample extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
  }

  init() {
    this.data = {};

    // sometimes for some reason this method is called without resolved pointer
    // TODO: fix it and remove the following workaround
    if (!this.componentSchema || !this.pointer) {
      return;
    }
    let base = {};
    let sample;

    // got pointer not directly to the schema but e.g. to response obj
    if (this.componentSchema.schema) {
      base = this.componentSchema;
      this.componentSchema = this.componentSchema.schema;
    }

    if (base.examples && base.examples['application/json']) {
      sample = base.examples['application/json'];
    } else {
      this.dereference(this.componentSchema);
      sample = SchemaSampler.instantiate(this.componentSchema);
    }

    this.data.sample = sample;


    this.element.addEventListener('click', (event) => {
      var collapsed, target = event.target;
      if (event.target.className === 'collapser') {
        collapsed = target.parentNode.getElementsByClassName('collapsible')[0];
        if (collapsed.parentNode.classList.contains('collapsed')) {
          collapsed.parentNode.classList.remove('collapsed');
        } else {
          collapsed.parentNode.classList.add('collapsed');
        }
      }
    });
  }
}
SchemaSample.parameters = SchemaSample.parameters.concat([[ElementRef]]);
