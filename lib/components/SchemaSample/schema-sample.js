'use strict';

import {RedocComponent, BaseComponent} from '../base';

import SchemaSampler from 'json-schema-instantiator';

@RedocComponent({
  selector: 'schema-sample',
  templateUrl: './lib/components/SchemaSample/schema-sample.html'
})
export default class SchemaSample extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
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
  }
}
