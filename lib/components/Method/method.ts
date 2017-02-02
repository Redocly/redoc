'use strict';
import { Input, HostBinding, Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import JsonPointer from '../../utils/JsonPointer';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/schema-helper.service';
import { OptionsService } from '../../services/';


interface MethodInfo {
  apiUrl: string;
  httpMethod: string;
  path: string;
  info: {
    tags: string[];
    description: string;
  };
  bodyParam: any;
  summary: any;
  anchor: any;
  externalDocs: {
    url: string;
    description?: string;
  }
}

@Component({
  selector: 'method',
  templateUrl: './method.html',
  styleUrls: ['./method.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Method extends BaseComponent implements OnInit {
  @Input() pointer :string;
  @Input() parentTagId :string;

  @HostBinding('attr.operation-id') operationId;

  method: MethodInfo;

  constructor(specMgr:SpecManager, private optionsService: OptionsService) {
    super(specMgr);
  }

  init() {
    this.operationId = this.componentSchema.operationId;

    this.method = {
      httpMethod: JsonPointer.baseName(this.pointer),
      path: JsonPointer.baseName(this.pointer, 2),
      info: {
        description: this.componentSchema.description,
        tags: this.filterMainTags(this.componentSchema.tags)
      },
      bodyParam: this.findBodyParam(),
      summary: SchemaHelper.methodSummary(this.componentSchema),
      apiUrl: this.getBaseUrl(),
      anchor: this.buildAnchor(),
      externalDocs: this.componentSchema.externalDocs
    };
  }

  buildAnchor() {
    if (this.operationId) {
      return 'operation/' + encodeURIComponent(this.componentSchema.operationId);
    } else {
      return this.parentTagId + encodeURIComponent(this.pointer);
    }
  }

  getBaseUrl():string {
    if (this.optionsService.options.hideHostname) {
      return this.specMgr.basePath;
    } else {
      return this.specMgr.apiUrl;
    }
  }

  filterMainTags(tags) {
    var tagsMap = this.specMgr.getTagsMap();
    if (!tags) return [];
    return tags.filter(tag => tagsMap[tag] && tagsMap[tag]['x-traitTag']);
  }

  findBodyParam() {
    let pathParams = this.specMgr.getMethodParams(this.pointer);
    let bodyParam = pathParams.find(param => param.in === 'body');
    return bodyParam;
  }

  ngOnInit() {
    this.preinit();
  }
}
