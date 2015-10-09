'use strict';

import {Component, View, OnInit, CORE_DIRECTIVES} from 'angular2/angular2';
import {SchemaManager} from '../../utils/SchemaManager';
import {JsonPointer} from '../../utils/JsonPointer';

@Component({
  selector: 'method',
  properties: ['pointer'],
  lifecycle: [OnInit]
})
@View({
  templateUrl: './lib/components/Method/method.html',
  directives: [CORE_DIRECTIVES]
})
export class Method {
  constructor(schemaMgr) {
    this.data = null;
    this.schemaMgr = schemaMgr;
  }

  onInit() {
    this.extractData();
  }

  extractData() {
    this.data = {};
    var methodInfo = this.schemaMgr.byPointer(this.pointer);

    this.data.method = JsonPointer.baseName(this.pointer);
    this.data.path = JsonPointer.baseName(this.pointer, 2);
    this.data.methodInfo = methodInfo;
    //TODO: check and apply hooks to modify data
  }
}
Method.parameters = [[SchemaManager]];
