'use strict';

import { ElementRef } from '@angular/core';

import SchemaSampler from 'json-schema-instantiator';

import { RedocComponent, BaseComponent, SchemaManager } from '../base';
import { JsonFormatter } from '../../utils/JsonFormatterPipe';

@RedocComponent({
  selector: 'schema-sample',
  templateUrl: './schema-sample.html',
  pipes: [JsonFormatter],
  styleUrls: ['./schema-sample.css']
})
export class SchemaSample extends BaseComponent {
  element: any;
  data: any;
  constructor(schemaMgr:SchemaManager, elementRef:ElementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
  }

  init() {
    this.data = {};

    let base:any = {};
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
