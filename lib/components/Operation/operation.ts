'use strict';
import { Input, HostBinding, Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import JsonPointer from '../../utils/JsonPointer';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/schema-helper.service';
import { OptionsService, MenuService } from '../../services/';
import { SwaggerBodyParameter } from '../../utils/swagger-typings';

export interface OperationInfo {
  verb: string;
  path: string;
  info: {
    tags: string[];
    description: string;
  };
  bodyParam: any;
  summary: string;
  anchor: string;
  externalDocs?: {
    url: string;
    description?: string;
  }
}

@Component({
  selector: 'operation',
  templateUrl: './operation.html',
  styleUrls: ['./operation.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Operation extends BaseComponent implements OnInit {
  @Input() pointer :string;
  @Input() parentTagId :string;

  @HostBinding('attr.operation-id') operationId;

  operation: OperationInfo;
  pathInMiddlePanel: boolean;

  constructor(
    specMgr:SpecManager,
    private optionsService: OptionsService,
    private menu: MenuService) {
    super(specMgr);

    this.pathInMiddlePanel = optionsService.options.pathInMiddlePanel;
  }

  init() {
    this.operationId = this.componentSchema.operationId;

    this.operation = {
      verb: JsonPointer.baseName(this.pointer),
      path: JsonPointer.baseName(this.pointer, 2),
      info: {
        description: this.componentSchema.description,
        tags: this.filterMainTags(this.componentSchema.tags)
      },
      bodyParam: this.findBodyParam(),
      summary: SchemaHelper.operationSummary(this.componentSchema),
      anchor: this.buildAnchor(),
      externalDocs: this.componentSchema.externalDocs
    };
  }

  buildAnchor():string {
    return this.menu.hashFor(this.pointer,
      { type: 'operation', operationId: this.operationId, pointer: this.pointer },
      this.parentTagId );
  }

  filterMainTags(tags) {
    var tagsMap = this.specMgr.getTagsMap();
    if (!tags) return [];
    return tags.filter(tag => tagsMap[tag] && tagsMap[tag]['x-traitTag']);
  }

  findBodyParam():SwaggerBodyParameter {
    let params = this.specMgr.getOperationParams(this.pointer);
    let bodyParam = params.find(param => param.in === 'body');
    return bodyParam;
  }

  ngOnInit() {
    this.preinit();
  }
}
