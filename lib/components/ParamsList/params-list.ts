'use strict';

import { RedocComponent, BaseComponent, SpecManager } from '../base';
import { JsonSchema } from '../JsonSchema/json-schema';
import { JsonSchemaLazy } from '../JsonSchema/json-schema-lazy';
import { SchemaHelper } from '../../services/schema-helper.service';

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

  params: Array<any>;
  empty: boolean;
  bodyParam: any;

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    this.params = [];
    let paramsList = this.specMgr.getMethodParams(this.pointer, true);

    paramsList = paramsList.map(paramSchema => {
      let propPointer = paramSchema._pointer;
      if (paramSchema.in === 'body') return paramSchema;
      paramSchema._name = paramSchema.name;
      return SchemaHelper.preprocess(paramSchema,propPointer, this.pointer);
    });

    let paramsMap = this.orderParams(paramsList);

    if (paramsMap.body && paramsMap.body.length) {
      let bodyParam = paramsMap.body[0];
      bodyParam.pointer = bodyParam._pointer;
      this.bodyParam = bodyParam;
      paramsMap.body = undefined;
    }

    this.empty = !(Object.keys(paramsMap).length || this.bodyParam);

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
    this.params = params;
  }

  orderParams(params):any {
    let res = {};
    params.forEach((param) => safePush(res, param.in, param));
    return res;
  }
}
