'use strict';

import { Component, ViewChildren, QueryList, Input,
 ChangeDetectionStrategy, OnInit, HostBinding } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { BaseComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { Tabs } from '../../shared/components/index';
import { AppStateService } from '../../services/index';

@Component({
  selector: 'request-samples',
  templateUrl: './request-samples.html',
  styleUrls: ['./request-samples.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestSamples extends BaseComponent implements OnInit {
  @Input() pointer:string;
  @Input() schemaPointer:string;
  @ViewChildren(Tabs) childQuery:QueryList<Tabs>;
  @HostBinding('attr.hidden') hidden;

  childTabs: Tabs;
  selectedLang: Subject<any>;
  samples: Array<any>;

  constructor(specMgr:SpecManager, public appState:AppStateService) {
    super(specMgr);

    this.selectedLang = this.appState.samplesLanguage;
  }

  changeLangNotify(lang) {
    this.selectedLang.next(lang);
  }

  init() {
    this.schemaPointer = this.schemaPointer ? JsonPointer.join(this.schemaPointer, 'schema') : null;
    this.samples = this.componentSchema['x-code-samples'] || [];
    if (!this.schemaPointer && !this.samples.length) this.hidden = true;
  }

  ngOnInit() {
    this.preinit();
  }
}
