'use strict';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';
import ApiInfo from '../ApiInfo/api-info';
import MethodsList from '../MethodsList/methods-list';

@RedocComponent({
  selector: 'redoc',
  providers: [SchemaManager],
  templateUrl: './lib/components/Redoc/redoc.html',
  directives: [ApiInfo, MethodsList]
})
export default class Redoc extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }
}
