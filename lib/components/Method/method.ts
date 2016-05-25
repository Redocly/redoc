'use strict';
import { Input } from '@angular/core';
import JsonPointer from '../../utils/JsonPointer';
import { RedocComponent, BaseComponent, SchemaManager} from '../base';

import { ParamsList } from '../ParamsList/params-list';
import { ResponsesList } from '../ResponsesList/responses-list';
import { ResponsesSamples } from '../ResponsesSamples/responses-samples';
import { SchemaSample } from '../SchemaSample/schema-sample';
import { RequestSamples } from '../RequestSamples/request-samples';

@RedocComponent({
  selector: 'method',
  templateUrl: './method.html',
  styleUrls: ['./method.css'],
  directives: [ ParamsList, ResponsesList, ResponsesSamples, SchemaSample, RequestSamples ],
  detect: true
})
export class Method extends BaseComponent {
  data:any;
  @Input() tag:string;
  constructor(schemaMgr:SchemaManager) {
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
    if (this.componentSchema.operationId) {
      this.data.methodAnchor = 'operation/' + encodeURIComponent(this.componentSchema.operationId);
    } else {
      this.data.methodAnchor = 'tag/' + encodeURIComponent(this.tag + this.pointer);
    }
  }

  filterMainTags(tags) {
    var tagsMap = this.schemaMgr.getTagsMap();
    if (!tags) return [];
    return tags.filter(tag => tagsMap[tag] && tagsMap[tag]['x-traitTag']);
  }

  findBodyParam() {
    let pathParams = this.schemaMgr.getMethodParams(this.pointer, true);
    let bodyParam = pathParams.find(param => param.in === 'body');
    return bodyParam;
  }
}
