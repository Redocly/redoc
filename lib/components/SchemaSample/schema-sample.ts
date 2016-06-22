'use strict';

import { ElementRef, Input } from '@angular/core';

import * as OpenAPISampler from 'openapi-sampler';

import { RedocComponent, BaseComponent, SpecManager } from '../base';
import { JsonFormatter } from '../../utils/JsonFormatterPipe';
import { SchemaNormalizer } from '../../services/schema-normalizer.service';

@RedocComponent({
  selector: 'schema-sample',
  templateUrl: './schema-sample.html',
  pipes: [JsonFormatter],
  styleUrls: ['./schema-sample.css']
})
export class SchemaSample extends BaseComponent {
  element: any;
  data: any;
  @Input() skipReadOnly:boolean;

  private _normalizer:SchemaNormalizer;

  constructor(schemaMgr:SpecManager, elementRef:ElementRef) {
    super(schemaMgr);
    this.element = elementRef.nativeElement;
    this._normalizer = new SchemaNormalizer(schemaMgr);
  }

  init() {
    this.bindEvents();
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
      this.componentSchema = this._normalizer.normalize(this.componentSchema, this.pointer);
      if (this.fromCache()) {
        return;
      }
      try {
        sample = OpenAPISampler.sample(this.componentSchema, {
          skipReadOnly: this.skipReadOnly
        });
      } catch(e) {
        // no sample available
      }
    }
    this.cache(sample);
    this.data.sample = sample;
  }

  cache(sample) {
    if (this.skipReadOnly) {
      this.componentSchema['x-redoc-ro-sample'] = sample;
    } else {
      this.componentSchema['x-redoc-rw-sample'] = sample;
    }
  }

  fromCache() {
    if (this.skipReadOnly && this.componentSchema['x-redoc-ro-sample']) {
      this.data.sample = this.componentSchema['x-redoc-ro-sample'];
      return true;
    } else if (this.componentSchema['x-redoc-rw-sample']) {
      this.data.sample = this.componentSchema['x-redoc-rw-sample'];
      return true;
    }
    return false;
  }

  bindEvents() {
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
