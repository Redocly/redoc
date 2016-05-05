'use strict';

import { forwardRef, ViewChildren, QueryList } from '@angular/core';

import { RedocComponent, BaseComponent, SchemaManager } from '../base';
import JsonPointer from '../../utils/JsonPointer';
import { Tabs, Tab } from '../..//shared/components/index';
import { SchemaSample } from '../index';
import { PrismPipe } from '../../utils/pipes';
import { RedocEventsService } from '../../services/index';

@RedocComponent({
  selector: 'request-samples',
  templateUrl: './lib/components/RequestSamples/request-samples.html',
  styleUrls: ['./lib/components/RequestSamples/request-samples.css'],
  directives: [forwardRef(() =>SchemaSample), Tabs, Tab],
  inputs: ['schemaPointer'],
  pipes: [PrismPipe]
})
@Reflect.metadata('parameters', [[SchemaManager], [RedocEventsService], [new ViewChildren(Tabs), QueryList]])
export class RequestSamples extends BaseComponent {
  constructor(schemaMgr, events, childQuery) {
    super(schemaMgr);
    childQuery.changes.subscribe(() => {
      this.childTabs = childQuery.first;
    });
    this.events = events;
  }

  init() {
    this.subscribeForEvents();
  }

  changeLangNotify(lang) {
    this.events.samplesLanguageChanged.next(lang);
  }

  subscribeForEvents() {
    this.events.samplesLanguageChanged.subscribe((sampleLang) => {
      if (!this.childTabs) return;
      this.childTabs.selectyByTitle(sampleLang);
    });
  }

  prepareModel() {
    this.data = {};
    this.data.schemaPointer = JsonPointer.join(this.schemaPointer, 'schema');
    this.data.samples = this.componentSchema['x-code-samples'] || [];
  }
}
