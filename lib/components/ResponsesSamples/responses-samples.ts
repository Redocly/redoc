'use strict';

import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { statusCodeType, getJsonLike } from '../../utils/helpers';


function isNumeric(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}

function hasExample(response) {
  return ((response.examples && getJsonLike(response.examples)) ||
    response.schema);
}

@Component({
  selector: 'responses-samples',
  templateUrl: './responses-samples.html',
  styleUrls: ['./responses-samples.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsesSamples extends BaseComponent implements OnInit {
  @Input() pointer:string;

  data: any;

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    this.data = {};
    this.data.responses = [];

    let responses = this.componentSchema;
    if (!responses) return;

    let hasSuccessResponses = false;
    responses = Object.keys(responses).filter(respCode => {
      if ((parseInt(respCode) >= 100) && (parseInt(respCode) <=399)) {
        hasSuccessResponses = true;
      }
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
      resp.type = statusCodeType(resp.code, hasSuccessResponses);
      return resp;
    })
    .filter(response => hasExample(response));
    this.data.responses = responses;
  }

  ngOnInit() {
    this.preinit();
  }
}
