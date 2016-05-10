'use strict';

import {RedocComponent, BaseComponent, SchemaManager} from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { JsonSchema } from '../JsonSchema/json-schema';
import { JsonSchemaLazy } from '../JsonSchema/json-schema-lazy';
import { Zippy } from '../../shared/components/index';
import { statusCodeType } from '../../utils/helpers';
import { OptionsService } from '../../services/index';

function isNumeric(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}

@RedocComponent({
  selector: 'responses-list',
  templateUrl: './lib/components/ResponsesList/responses-list.html',
  styleUrls: ['./lib/components/ResponsesList/responses-list.css'],
  directives: [JsonSchema, Zippy, JsonSchemaLazy]
})
@Reflect.metadata('parameters', [[SchemaManager], [OptionsService]])
export class ResponsesList extends BaseComponent {
  constructor(schemaMgr, optionsMgr) {
    super(schemaMgr);
    this.options = optionsMgr.options;
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
        resp = this.schemaMgr.byPointer(resp.$ref);
        resp.pointer = ref;
      }

      resp.empty = !resp.schema;
      resp.code = respCode;
      resp.type = statusCodeType(resp.code);
      if (resp.headers) {
        resp.headers = Object.keys(resp.headers).map((k) => {
          let respInfo = resp.headers[k];
          respInfo.name = k;
          return respInfo;
        });
        resp.empty = false;
      }
      resp.extendable = resp.headers || resp.length;
      return resp;
    });
    this.data.responses = responses;
  }
}
