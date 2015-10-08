'use strict';

import {Component, View} from 'angular2/angular2';
import {SchemaManager} from '../../utils/SchemaManager';
import {RedocInfo} from '../RedocInfo/redoc-info';
import {PathsList} from '../PathsList/paths-list';

@Component({
  selector: 'redoc',
  bindings: [SchemaManager]
})
@View({
  templateUrl: './lib/components/Redoc/redoc.html',
  directives: [RedocInfo, PathsList]
})
export class Redoc {
  constructor(schemaMgr) {
    this.data = null;
    this.schema = schemaMgr.schema;
    this.extractData();
  }

  extractData() {
    this.data = this.schema
    //TODO: check and apply hooks to modify data
  }
}
Redoc.parameters = [[SchemaManager]]
