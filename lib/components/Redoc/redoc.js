'use strict';

import {RedocComponent, BaseComponent} from '../base';
import SchemaManager from '../../utils/SchemaManager';
import ApiInfo from '../ApiInfo/api-info';
import MethodsList from '../MethodsList/methods-list';
import SideMenu from '../SideMenu/side-menu';
import {ChangeDetectionStrategy} from 'angular2/angular2';

@RedocComponent({
  selector: 'redoc',
  providers: [SchemaManager],
  templateUrl: './lib/components/Redoc/redoc.html',
  styleUrls: ['./lib/components/Redoc/redoc.css'],
  directives: [ApiInfo, MethodsList, SideMenu],
  changeDetection: ChangeDetectionStrategy.Default
})
export default class Redoc extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }
}
