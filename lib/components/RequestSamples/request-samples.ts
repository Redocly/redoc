'use strict';

import { Component, ViewChildren, QueryList, EventEmitter, Input,
 ChangeDetectionStrategy, OnInit, HostBinding } from '@angular/core';

import { BaseComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { Tabs } from '../../shared/components/index';
import { RedocEventsService } from '../../services/index';

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
  selectedLang: EventEmitter<any>;
  samples: Array<any>;

  constructor(specMgr:SpecManager, public events:RedocEventsService) {
    super(specMgr);

    this.selectedLang = this.events.samplesLanguageChanged;
  }


  changeLangNotify(lang) {
    this.events.samplesLanguageChanged.next(lang);
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
