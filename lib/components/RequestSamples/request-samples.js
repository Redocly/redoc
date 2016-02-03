'use strict';

import {RedocComponent, BaseComponent} from '../base';
import JsonPointer from '../../utils/JsonPointer';
import {Tabs, Tab} from '../../common/components/Tabs/tabs';
import SchemaSample from '../SchemaSample/schema-sample';
import {PrismPipe} from '../../utils/pipes';

import {ViewChildren, QueryList, ChangeDetectorRef, ChangeDetectionStrategy} from 'angular2/core';
import {redocEvents} from '../../events';

@RedocComponent({
  selector: 'request-samples',
  templateUrl: './lib/components/RequestSamples/request-samples.html',
  styleUrls: ['./lib/components/RequestSamples/request-samples.css'],
  directives: [SchemaSample, Tabs, Tab],
  inputs: ['bodySchemaPtr'],
  pipes: [PrismPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class RequestSamples extends BaseComponent {
  constructor(schemaMgr, tabs, changeDetector) {
    super(schemaMgr);
    tabs.changes.subscribe(_ => {
      this.tabs = tabs.first;
      this.subscribeForEvents(_);
    });
    this.changeDetector = changeDetector;
  }

  changeLangNotify(lang) {
    redocEvents.samplesLanguageChanged.next(lang);
  }

  subscribeForEvents() {
    if (!this.tabs) return;
    redocEvents.samplesLanguageChanged.subscribe((sampleLang) => {
      this.tabs.selectyByTitle(sampleLang);
      this.changeDetector.markForCheck();
    });
  }

  prepareModel() {
    this.data = {};
    this.data.bodySchemaPtr = JsonPointer.join(this.bodySchemaPtr, 'schema');
    this.data.samples = this.componentSchema['x-code-samples'] || [];
  }
}

RequestSamples.parameters = RequestSamples.parameters.concat([ [new ViewChildren(Tabs), QueryList], [ChangeDetectorRef] ]);
