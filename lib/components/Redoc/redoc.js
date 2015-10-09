'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {SchemaManager} from '../../utils/SchemaManager';
import {ApiInfo} from '../ApiInfo/api-info';
import {PathsList} from '../PathsList/paths-list';

@RedocComponent({
  selector: 'redoc',
  bindings: [SchemaManager],
  templateUrl: './lib/components/Redoc/redoc.html',
  directives: [ApiInfo, PathsList]
})
export class Redoc extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }
}
