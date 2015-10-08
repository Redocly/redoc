'use strict';

import {Component, View, OnInit, CORE_DIRECTIVES} from 'angular2/angular2';
import {SchemaManager} from '../../utils/SchemaManager';
import {JsonPointer} from '../../utils/JsonPointer';
import {methods as swaggerMethods} from  '../../utils/swagger-defs';
import {Method} from '../Method/method';

@Component({
  selector: 'methods-list',
  properties: ['pointer'],
  lifecycle: [OnInit]
})
@View({
  templateUrl: './lib/components/MethodsList/methods-list.html',
  directives: [CORE_DIRECTIVES, Method]
})
export class MethodsList {
  _name: string;

  constructor(schemaMgr) {
    this.data = null;
    this.schemaMgr = schemaMgr;
    //this.pointer = pointer;
    //this.extractData();
  }

  onInit() {
    this.extractData();
  }

  extractData() {
    this.data = {};
    var pathInfo = this.schemaMgr.byPointer(this.pointer);

    this.data.path = JsonPointer.dirName(this.pointer);
    this.data.methods = Object.keys(pathInfo).filter((k) => swaggerMethods.has(k));
    //TODO: check and apply hooks to modify data
  }
}
MethodsList.parameters = [[SchemaManager]];
