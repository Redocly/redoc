'use strict';

import { ViewChildren, QueryList } from '@angular/core';

import { RedocComponent, BaseComponent, SchemaManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { Tabs, Tab } from '../../shared/components/index';
import { SchemaSample } from '../SchemaSample/schema-sample';
import { PrismPipe } from '../../utils/pipes';
import { RedocEventsService } from '../../services/index';

@RedocComponent({
  selector: 'request-samples',
  templateUrl: './lib/components/RequestSamples/request-samples.html',
  styleUrls: ['./lib/components/RequestSamples/request-samples.css'],
  directives: [SchemaSample, Tabs, Tab],
  inputs: ['schemaPointer'],
  pipes: [PrismPipe],
  detect: true,
  onPushOnly: false
})
@Reflect.metadata('parameters', [[SchemaManager], [RedocEventsService], [new ViewChildren(Tabs), QueryList]])
export class RequestSamples extends BaseComponent {
  constructor(schemaMgr, events, childQuery) {
    super(schemaMgr);
    childQuery.changes.subscribe(() => {
      this.childTabs = childQuery.first;
    });
    this.events = events;
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
