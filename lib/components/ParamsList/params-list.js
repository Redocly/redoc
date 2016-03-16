'use strict';

import {RedocComponent, BaseComponent} from '../base';
import JsonSchema from '../JsonSchema/json-schema';
import JsonSchemaLazy from '../JsonSchema/json-schema-lazy';

function safePush(obj, prop, item) {
  if (!obj[prop]) obj[prop] = [];
  obj[prop].push(item);
}

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
    let paramsList = this.schemaMgr.getMethodParams(this.pointer, true);

    paramsList = paramsList.map((paramData) => {
      let propPointer = paramData._pointer;
      if (paramData.in === 'body') return paramData;
      return JsonSchema.injectPropertyData(paramData, paramData.name, propPointer);
    });

    let paramsMap = this.orderParams(paramsList);

    if (paramsMap.body && paramsMap.body.length) {
      let bodyParam = paramsMap.body[0];
      bodyParam.pointer = bodyParam._pointer;
      this.data.bodyParam = bodyParam;
      paramsMap.body = undefined;
    }

    this.data.noParams = !(Object.keys(paramsMap).length || this.data.bodyParam);

    let paramsPlaces = ['path', 'query', 'formData', 'header', 'body'];
    let params = [];
    paramsPlaces.forEach(place => {
      if (paramsMap[place] && paramsMap[place].length) {
        params.push({place: place, params: paramsMap[place]});
      }
    });
    this.data.params = params;
  }

  orderParams(params) {
    let res = {};
    params.forEach((param) => safePush(res, param.in, param));
    return res;
  }
}
