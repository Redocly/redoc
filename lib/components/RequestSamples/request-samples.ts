'use strict';

import { Component, ViewChildren, QueryList, EventEmitter, Input,
 ChangeDetectionStrategy } from '@angular/core';

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
export class RequestSamples extends BaseComponent {
  @Input() pointer:string;
  @Input() schemaPointer:string;
  @ViewChildren(Tabs) childQuery:QueryList<Tabs>;

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
    this.schemaPointer = JsonPointer.join(this.schemaPointer, 'schema');;
    this.samples = this.componentSchema['x-code-samples'] || [];
  }
}
