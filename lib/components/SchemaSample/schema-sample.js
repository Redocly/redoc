'use strict';

import {RedocComponent, BaseComponent} from '../base';

import SchemaSampler from 'json-schema-instantiator';

@RedocComponent({
  selector: 'schema-sample',
  templateUrl: './lib/components/SchemaSample/schema-sample.html'
})
export class SchemaSample extends BaseComponent {
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
    let sample;
    if (this.componentSchema.examples && this.componentSchema.examples['application/json']) {
      sample = this.componentSchema.examples['application/json'];
    } else {
      this.dereference(this.componentSchema.schema);
      sample = SchemaSampler.instantiate(this.componentSchema.schema);
    }

    this.data.sample = sample;
  }
}
