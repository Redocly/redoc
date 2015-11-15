'use strict';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';
import ApiInfo from '../ApiInfo/api-info';
import MethodsList from '../MethodsList/methods-list';
import SideMenu from '../SideMenu/side-menu';

@RedocComponent({
  selector: 'redoc',
  providers: [SchemaManager],
  templateUrl: './lib/components/Redoc/redoc.html',
  directives: [ApiInfo, MethodsList, SideMenu]
})
export default class Redoc extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }
}
