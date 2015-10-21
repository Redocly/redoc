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
    if (!this.componentSchema || !this.pointer) {
      console.log(this.pointer);
      return;
    }
    this.dereference();
    let sample = SchemaSampler.instantiate(this.componentSchema);
    this.data.sample = sample;
  }
}
