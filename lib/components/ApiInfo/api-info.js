'use strict';

import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {SchemaManager} from '../../utils/SchemaManager';

@Component({
  selector: 'api-info'
})
@View({
  templateUrl: './lib/components/ApiInfo/api-info.html',
  styleUrls: ['./lib/components/ApiInfo/api-info.css'],
  directives: [CORE_DIRECTIVES]
})
export class ApiInfo {
  constructor(schemaMgr) {
    this.data = null;
    this.schema = schemaMgr.schema;
    this.extractData();
  }

  extractData() {
    this.data = this.schema.info;

    //TODO: check and apply hooks to modify data
  }
}
ApiInfo.parameters = [[SchemaManager]];
