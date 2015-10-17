'use strict';

import {JsonPointer} from '../../utils/JsonPointer';
import {RedocComponent, BaseComponent} from '../base';
import {JsonSchemaView} from '../JsonSchemaView/json-schema-view';

/* inject JsonPointer into array elements */
function injectPointers(array, root) {
  if (!array) return array;
  return array.map((element, idx) => {
    element.$$pointer = JsonPointer.join(root, idx);
    return element;
  });
}

@RedocComponent({
  selector: 'params-list',
  templateUrl: './lib/components/ParamsList/params-list.html',
  styleUrls: ['./lib/components/ParamsList/params-list.css'],
  directives: [JsonSchemaView]
})
export class ParamsList extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    let params = injectPointers(this.componentSchema, this.pointer) || [];
    let pathParams = this.getPathParams() || [];
    params = params.concat(pathParams);
    params = this.resolveRefs(params);
    this.sortParams(params);

    // temporary handle body param
    if (params.length && params[params.length - 1].in === 'body') {
      let bodyParam = params.pop();
      bodyParam.type = bodyParam.schema.type
        || JsonPointer.baseName(bodyParam.schema.$ref);
      bodyParam.pointer = bodyParam.$$pointer;
      this.data.bodyParam = bodyParam;
    }

    this.data.noParams = !(params.length || this.data.bodyParam);
    this.data.params = params;
  }

  getPathParams() {
    let ptr = JsonPointer.dirName(this.pointer, 2) + '/parameters';
    let pathParams = this.schemaMgr.byPointer(ptr);
    if (Array.isArray(pathParams)) {
      return injectPointers(pathParams, ptr);
    }
    if (pathParams && pathParams.$ref) {
      return injectPointers(this.schemaMgr.byPointer(pathParams.$ref), pathParams.$ref);
    }

    return [];
  }

  resolveRefs(params) {
    return params.map(param => {
      if (param.$ref) {
        return this.schemaMgr.byPointer(param.$ref);
      } else {
        return param;
      }
    });
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
