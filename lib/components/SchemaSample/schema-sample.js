'use strict';

import { ElementRef } from '@angular/core';

import * as OpenAPISampler from 'openapi-sampler';

import { RedocComponent, BaseComponent, SchemaManager } from '../base';
import { JsonFormatter } from '../../utils/JsonFormatterPipe';

@RedocComponent({
  selector: 'schema-sample',
  templateUrl: './lib/components/SchemaSample/schema-sample.html',
  pipes: [JsonFormatter],
  styleUrls: ['./lib/components/SchemaSample/schema-sample.css']
})
@Reflect.metadata('parameters', [[SchemaManager], [ElementRef]])
export class SchemaSample extends BaseComponent {
  constructor(schemaMgr, elementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
  }

  init() {
    this.data = {};

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
      try {
        sample = OpenAPISampler.sample(this.componentSchema);
      } catch(e) {
        console.error('@@@@@@@@@@@@@@@@@@@' + e);
      }
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
