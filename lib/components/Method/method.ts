'use strict';
import { Input, Component } from '@angular/core';
import JsonPointer from '../../utils/JsonPointer';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/schema-helper.service';

@Component({
  selector: 'method',
  templateUrl: './method.html',
  styleUrls: ['./method.css'],
})
export class Method extends BaseComponent {
  @Input() pointer:string;
  @Input() tag:string;

  method:any;

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    this.method = {};
    this.method.apiUrl = this.specMgr.apiUrl;
    this.method.httpMethod = JsonPointer.baseName(this.pointer);
    this.method.path = JsonPointer.baseName(this.pointer, 2);
    this.method.info = this.componentSchema;
    this.method.info.tags = this.filterMainTags(this.method.info.tags);
    this.method.bodyParam = this.findBodyParam();
    this.method.summary = SchemaHelper.methodSummary(this.componentSchema);
    if (this.componentSchema.operationId) {
      this.method.anchor = 'operation/' + encodeURIComponent(this.componentSchema.operationId);
    } else {
      this.method.anchor = this.tag + encodeURIComponent(this.pointer);
    }
  }

  filterMainTags(tags) {
    var tagsMap = this.specMgr.getTagsMap();
    if (!tags) return [];
    return tags.filter(tag => tagsMap[tag] && tagsMap[tag]['x-traitTag']);
  }

  findBodyParam() {
    let pathParams = this.specMgr.getMethodParams(this.pointer, true);
    let bodyParam = pathParams.find(param => param.in === 'body');
    return bodyParam;
  }
}
