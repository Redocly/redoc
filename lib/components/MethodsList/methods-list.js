'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {methods as swaggerMethods} from  '../../utils/swagger-defs';
import {Method} from '../Method/method';

@RedocComponent({
  selector: 'methods-list',
  templateUrl: './lib/components/MethodsList/methods-list.html',
  styleUrls: ['./lib/components/MethodsList/methods-list.css'],
  directives: [Method]
})
export class MethodsList extends BaseComponent {

  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    let pathInfo = this.componentSchema;

    this.data.methods = Object.keys(pathInfo).filter((k) => swaggerMethods.has(k));
    // TODO: check $ref field
  }
}
