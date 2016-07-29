'use strict';

import {RedocComponent, BaseComponent, SpecManager} from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { JsonSchema } from '../JsonSchema/json-schema';
import { JsonSchemaLazy } from '../JsonSchema/json-schema-lazy';
import { Zippy } from '../../shared/components/index';
import { statusCodeType } from '../../utils/helpers';
import { OptionsService } from '../../services/index';
import { SchemaHelper } from '../../services/schema-helper.service';

function isNumeric(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}

@RedocComponent({
  selector: 'responses-list',
  templateUrl: './responses-list.html',
  styleUrls: ['./responses-list.css'],
  directives: [JsonSchema, Zippy, JsonSchemaLazy],
  detect: true
})
export class ResponsesList extends BaseComponent {
  responses: Array<any>;
  options: any;
  constructor(specMgr:SpecManager, optionsMgr:OptionsService) {
    super(specMgr);
    this.options = optionsMgr.options;
  }

  init() {
    this.responses = [];

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

      resp.empty = !resp.schema;
      resp.code = respCode;
      resp.type = statusCodeType(resp.code);
      if (resp.headers && !(resp.headers instanceof Array)) {
        resp.headers = Object.keys(resp.headers).map((k) => {
          let respInfo = resp.headers[k];
          respInfo.name = k;
          return SchemaHelper.preprocess(respInfo, this.pointer, this.pointer);
        });
        resp.empty = false;
      }
      resp.extendable = resp.headers || resp.length;
      return resp;
    });
    this.responses = responses;
  }

  trackByCode(idx, el) {
    return el.code;
  }
}
