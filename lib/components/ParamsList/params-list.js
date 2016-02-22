'use strict';

import {RedocComponent, BaseComponent} from '../base';
import JsonSchema from '../JsonSchema/json-schema';
import JsonSchemaLazy from '../JsonSchema/json-schema-lazy';

@RedocComponent({
  selector: 'params-list',
  templateUrl: './lib/components/ParamsList/params-list.html',
  styleUrls: ['./lib/components/ParamsList/params-list.css'],
  directives: [JsonSchema, JsonSchemaLazy]
})
export default class ParamsList extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    let params = this.schemaMgr.getMethodParams(this.pointer, true);
    this.sortParams(params);

    // temporary handle body param
    if (params.length && params[params.length - 1].in === 'body') {
      let bodyParam = params.pop();
      bodyParam.pointer = bodyParam._pointer;
      this.data.bodyParam = bodyParam;
    }

    params = params.map((paramData) => {
      let propPointer = paramData._pointer;
      return JsonSchema.injectPropData(paramData, paramData.name, propPointer);
    });

    this.data.noParams = !(params.length || this.data.bodyParam);
    this.data.params = params;
  }

  sortParams(params) {
    const sortOrder = {
      'path' : 0,
      'query' : 10,
      'formData' : 20,
      'header': 40,
      'body': 50
    };

    params.sort((a, b) => sortOrder[a.in] - sortOrder[b.in]);
  }
}
