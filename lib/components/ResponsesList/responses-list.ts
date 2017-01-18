'use strict';

import { Component,
   Input,
   OnInit,
   AfterViewInit,
   ChangeDetectionStrategy,
   ChangeDetectorRef
 } from '@angular/core';
import { BaseSearchableComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { statusCodeType } from '../../utils/helpers';
import { OptionsService, AppStateService } from '../../services/index';
import { SchemaHelper } from '../../services/schema-helper.service';

function isNumeric(n) {
  return (!isNaN(parseFloat(n)) && isFinite(n));
}

@Component({
  selector: 'responses-list',
  templateUrl: './responses-list.html',
  styleUrls: ['./responses-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponsesList extends BaseSearchableComponent implements OnInit {
  @Input() pointer:string;

  responses: Array<any>;
  options: any;

  constructor(specMgr:SpecManager,
    optionsMgr:OptionsService,
    app: AppStateService,
    private cdr: ChangeDetectorRef
  ) {
    super(specMgr, app);
    this.options = optionsMgr.options;
  }

  init() {
    this.responses = [];

    let responses = this.componentSchema;
    if (!responses) return;

    responses = Object.keys(responses).filter(respCode => {
      // only response-codes and "default"
      return ( isNumeric(respCode) || (respCode === 'default'));
    }).map(respCode => {
      let resp = responses[respCode];
      resp.pointer = JsonPointer.join(this.pointer, respCode);
      if (resp.$ref) {
        let ref = resp.$ref;
        resp = Object.assign({}, this.specMgr.byPointer(resp.$ref));
        resp.pointer = ref;
      }

      resp.empty = !resp.schema;
      resp.code = respCode;
      resp.type = statusCodeType(resp.code);

      resp.expanded = false;
      if (this.options.expandResponses) {
        if (this.options.expandResponses === 'all' || this.options.expandResponses.has(respCode.toString())) {
          resp.expanded = true;
        }
      }

      if (resp.headers && !(resp.headers instanceof Array)) {
        resp.headers = Object.keys(resp.headers).map((k) => {
          let respInfo = resp.headers[k];
          respInfo.name = k;
          return SchemaHelper.preprocess(respInfo, this.pointer, this.pointer);
        });
        resp.empty = false;
      }
      resp.extendable = resp.headers || resp.length;
      return resp;
    });
    this.responses = responses;
  }

  trackByCode(_, el) {
    return el.code;
  }

  ensureSearchIsShown(ptr: string) {
    if (ptr.startsWith(this.pointer)) {
      let code = JsonPointer.relative(this.pointer, ptr)[0];
      if (code && this.componentSchema[code]) {
        this.componentSchema[code].expanded = true;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    }
  }

  ngOnInit() {
    this.preinit();
  }
}
