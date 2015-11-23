'use strict';

import {RedocComponent, BaseComponent} from '../base';
import JsonPointer from '../../utils/JsonPointer';
import {Tabs, Tab} from '../../common/components/Tabs/tabs';
import SchemaSample from '../SchemaSample/schema-sample';
import {statusCodeType} from '../../utils/helpers';


function isNumeric(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}

function hasExample(response) {
  return ((response.examples && response.examples['application/json']) ||
    response.schema);
}

@RedocComponent({
  selector: 'responses-samples',
  templateUrl: './lib/components/ResponsesSamples/responses-samples.html',
  styleUrls: ['./lib/components/ResponsesSamples/responses-samples.css'],
  directives: [SchemaSample, Tabs, Tab]
})
export default class ResponsesSamples extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    let responses = this.componentSchema;
    responses = Object.keys(responses).filter(respCode => {
      // only response-codes and "default"
      return ( isNumeric(respCode) || (respCode === 'default'));
    }).map(respCode => {
      let resp = responses[respCode];
      resp.pointer = JsonPointer.join(this.pointer, respCode);
      if (resp.$ref) {
        let ref = resp.$ref;
        resp = this.schemaMgr.byPointer(resp.$ref);
        resp.pointer = ref;
      }

      resp.code = respCode;
      resp.type = statusCodeType(resp.code);
      return resp;
    })
    .filter(response => hasExample(response));
    this.data.responses = responses;
  }
}
