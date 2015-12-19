'use strict';

import {JsonPointer} from '../../utils/JsonPointer';
import {RedocComponent, BaseComponent} from '../base';
import ParamsList from '../ParamsList/params-list';
import ResponsesList from '../ResponsesList/responses-list';
import ResponsesSamples from '../ResponsesSamples/responses-samples';
import SchemaSample from '../SchemaSample/schema-sample';

@RedocComponent({
  selector: 'method',
  templateUrl: './lib/components/Method/method.html',
  styleUrls: ['./lib/components/Method/method.css'],
  directives: [ParamsList, ResponsesList, ResponsesSamples, SchemaSample],
  inputs: ['tag']
})
export default class Method extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    this.data.apiUrl = this.schemaMgr.apiUrl;
    this.data.httpMethod = JsonPointer.baseName(this.pointer);
    this.data.path = JsonPointer.baseName(this.pointer, 2);
    this.data.methodInfo = this.componentSchema;
    this.data.methodInfo.tags = this.filterMainTags(this.data.methodInfo.tags);
    this.data.bodyParam = this.findBodyParam();
  }

  filterMainTags(tags) {
    var tagsMap = this.schemaMgr.getTagsMap();
    return tags.filter(tag => tagsMap[tag] && tagsMap[tag]['x-traitTag']);
  }

  findBodyParam() {
    let pathParams = this.schemaMgr.getMethodParams(this.pointer, true);
    let bodyParam = pathParams.find(param => param.in === 'body');
    return bodyParam;
  }
}
