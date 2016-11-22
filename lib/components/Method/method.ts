'use strict';
import { Input, Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core';
import JsonPointer from '../../utils/JsonPointer';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/schema-helper.service';
import { OptionsService, AppStateService } from '../../services/';

@Component({
  selector: 'method',
  templateUrl: './method.html',
  styleUrls: ['./method.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Method extends BaseComponent implements OnInit {
  @Input() pointer:string;
  @Input() tag:string;
  @Input() posInfo: any;

  hidden = true;

  method:any;

  constructor(specMgr:SpecManager, private optionsService: OptionsService, private chDetector: ChangeDetectorRef,
  private appState: AppStateService, private el: ElementRef) {
    super(specMgr);
  }

  init() {
    this.method = {};
    if (this.optionsService.options.hideHostname) {
      this.method.apiUrl = this.specMgr.basePath;
    } else {
      this.method.apiUrl = this.specMgr.apiUrl;
    }
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

  show(res) {
    if (res) {
      this.el.nativeElement.firstElementChild.removeAttribute('hidden');
    } else {
      this.el.nativeElement.firstElementChild.setAttribute('hidden', 'hidden');
    }
  }

  ngOnInit() {
    this.preinit();
  }
}
