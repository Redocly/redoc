'use strict';

import { RedocComponent, BaseComponent, SchemaManager } from '../base';
import { JsonSchema } from '../JsonSchema/json-schema';
import {JsonSchemaLazy} from '../JsonSchema/json-schema-lazy';

function safePush(obj, prop, item) {
  if (!obj[prop]) obj[prop] = [];
  obj[prop].push(item);
}

@RedocComponent({
  selector: 'params-list',
  templateUrl: './params-list.html',
  styleUrls: ['./params-list.css'],
  directives: [JsonSchema, JsonSchemaLazy]
})
export class ParamsList extends BaseComponent {
  
  data:any;
  
  constructor(schemaMgr:SchemaManager) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    let paramsList = this.schemaMgr.getMethodParams(this.pointer, true);

    paramsList = paramsList.map((paramData) => {
      let propPointer = paramData._pointer;
      if (paramData.in === 'body') return paramData;
      return JsonSchema.injectPropertyData(paramData, paramData.name, propPointer, this.pointer);
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
    let placeHint = {
      path: `Used together with Path Templating, where the parameter value is actually part
        of the operation's URL. This does not include the host or base path of the API.
        For example, in /items/{itemId}, the path parameter is itemId`,
      query: `Parameters that are appended to the URL.
        For example, in /items?id=###, the query parameter is id`,
      formData: `Parameters that are submitted through a form.
        application/x-www-form-urlencoded, multipart/form-data or both are usually
        used as the content type of the request`,
      header: 'Custom headers that are expected as part of the request'
    };
    let params = [];
    paramsPlaces.forEach(place => {
      if (paramsMap[place] && paramsMap[place].length) {
        params.push({place: place, placeHint: placeHint[place], params: paramsMap[place]});
      }
    });
    this.data.params = params;
  }

  orderParams(params):any {
    let res = {};
    params.forEach((param) => safePush(res, param.in, param));
    return res;
  }
}
