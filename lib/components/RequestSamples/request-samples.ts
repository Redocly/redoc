'use strict';

import { ViewChildren, QueryList, EventEmitter, Input} from '@angular/core';

import { RedocComponent, BaseComponent, SpecManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { Tabs, Tab } from '../../shared/components/index';
import { SchemaSample } from '../SchemaSample/schema-sample';
import { PrismPipe } from '../../utils/pipes';
import { RedocEventsService } from '../../services/index';

import { CopyButton } from '../../shared/components/CopyButton/copy-button.directive';

@RedocComponent({
  selector: 'request-samples',
  templateUrl: './request-samples.html',
  styleUrls: ['./request-samples.css'],
  directives: [SchemaSample, Tabs, Tab, CopyButton],
  inputs: ['schemaPointer'],
  pipes: [PrismPipe],
  detect: true,
  onPushOnly: false
})
export class RequestSamples extends BaseComponent {
  childTabs: Tabs;
  selectedLang: EventEmitter<any>;
  data: any;
  @Input() schemaPointer:string;
  @ViewChildren(Tabs) childQuery:QueryList<Tabs>;
  constructor(specMgr:SpecManager, public events:RedocEventsService) {
    super(specMgr);

    this.selectedLang = this.events.samplesLanguageChanged;
  }


  changeLangNotify(lang) {
    this.events.samplesLanguageChanged.next(lang);
  }

  prepareModel() {
    this.data = {};
    this.data.schemaPointer = JsonPointer.join(this.schemaPointer, 'schema');
    this.data.samples = this.componentSchema['x-code-samples'] || [];
  }
}
