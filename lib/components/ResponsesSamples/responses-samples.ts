'use strict';

import { forwardRef } from '@angular/core';
import { RedocComponent, BaseComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { Tabs, Tab } from '../../shared/components/index';
import { SchemaSample } from '../index';
import { statusCodeType } from '../../utils/helpers';


function isNumeric(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}

function hasExample(response) {
  return ((response.examples && response.examples['application/json']) ||
    response.schema);
}

@RedocComponent({
  selector: 'responses-samples',
  templateUrl: './responses-samples.html',
  styleUrls: ['./responses-samples.css'],
  directives: [forwardRef( ()=> SchemaSample), Tabs, Tab]
})
export class ResponsesSamples extends BaseComponent {
  data: any;
  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  prepareModel() {
    this.data = {};
    this.data.responses = [];

    let responses = this.componentSchema;
    if (!responses) return;

    responses = Object.keys(responses).filter(respCode => {
      // only response-codes and "default"
      return ( isNumeric(respCode) || (respCode === 'default'));
    }).map(respCode => {
      let resp = responses[respCode];
      resp.pointer = JsonPointer.join(this.pointer, respCode);
      if (resp.$ref) {
        let ref = resp.$ref;
        resp = this.specMgr.byPointer(resp.$ref);
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
