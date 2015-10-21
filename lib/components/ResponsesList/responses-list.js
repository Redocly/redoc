'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {JsonPointer} from '../../utils/JsonPointer';
import {JsonSchemaView} from '../JsonSchemaView/json-schema-view';

function isNumeric(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}

@RedocComponent({
  selector: 'responses-list',
  templateUrl: './lib/components/ResponsesList/responses-list.html',
  styleUrls: ['./lib/components/ResponsesList/responses-list.css'],
  directives: [JsonSchemaView]
})
export class ResponsesList extends BaseComponent {
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
      return resp;
    });
    this.data.responses = responses;
  }
}
