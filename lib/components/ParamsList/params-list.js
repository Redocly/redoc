'use strict';

import {JsonPointer} from '../../utils/JsonPointer';
import {RedocComponent, BaseComponent} from '../base';

@RedocComponent({
  selector: 'params-list',
  templateUrl: './lib/components/ParamsList/params-list.html',
  styleUrls: ['./lib/components/ParamsList/params-list.css']
})
export class ParamsList extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    let params = this.componentSchema;
    let pathParams = this.getPathParams();
    if (pathParams) params.concat(pathParams);
    this.sortParams(params);

    // temporary hanlde body param
    if (params.length && params[params.length - 1].in === 'body') {
      let bodyParam = params.pop();
      bodyParam.type = bodyParam.schema.type
        || `Object(${JsonPointer.baseName(bodyParam.schema.$ref)})`;
      this.data.bodyParam = bodyParam;
    }

    this.data.noParams = !(params.length || this.data.bodyParam);
    this.data.params = params;
  }

  getPathParams() {
    let ptr = JsonPointer.dirName(this.pointer, 2) + '/parameters';
    let pathParams = this.schemaMgr.byPointer(ptr);
    if (Array.isArray(pathParams)) {
      return pathParams;
    }
    if (pathParams && pathParams.$ref) {
      return this.schemaMgr.byPointer(pathParams.$ref);
    }

    return [];
  }

  sortParams(params) {
    const sortOrder = {
      'path' : 0,
      'query' : 10,
      'formData' : 20,
      'header': 40,
      'body': 50
    };

    params.sort((a, b) => sortOrder[a] - sortOrder[b]);
  }
}
