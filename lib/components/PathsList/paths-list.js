'use strict';

import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';
import {SchemaManager} from '../../utils/SchemaManager';
import {MethodsList} from '../MethodsList/methods-list';
import {JsonPointerEscapePipe} from '../../utils/pipes';

@Component({
  selector: 'paths-list'
})
@View({
  templateUrl: './lib/components/PathsList/paths-list.html',
  directives: [CORE_DIRECTIVES, MethodsList],
  pipes: [JsonPointerEscapePipe]
})
export class PathsList {
  constructor(schemaMgr) {
    this.data = null;
    this.schema = schemaMgr.schema;
    this.extractData();
  }

  extractData() {
    this.data = {};
    this.data.paths = Object.keys(this.schema.paths)

    //TODO: check and apply hooks to modify data
  }
}
PathsList.parameters = [[SchemaManager]]
