'use strict';

import {RedocComponent, BaseComponent} from '../base';
import JsonPointer from '../../utils/JsonPointer';
import {Tabs, Tab} from '../../common/components/Tabs/tabs';
import SchemaSample from '../SchemaSample/schema-sample';
import {PrismPipe} from '../../utils/pipes';

@RedocComponent({
  selector: 'request-samples',
  templateUrl: './lib/components/RequestSamples/request-samples.html',
  styleUrls: ['./lib/components/RequestSamples/request-samples.css'],
  directives: [SchemaSample, Tabs, Tab],
  inputs: ['bodySchemaPtr'],
  pipes: [PrismPipe]
})
export default class RequestSamples extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    this.data.bodySchemaPtr = JsonPointer.join(this.bodySchemaPtr, 'schema');
    this.data.samples = this.componentSchema['x-code-samples'] || [];
  }
}
