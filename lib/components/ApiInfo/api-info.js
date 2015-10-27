'use strict';

import {RedocComponent, BaseComponent} from '../base';

@RedocComponent({
  selector: 'api-info',
  styleUrls: ['./lib/components/ApiInfo/api-info.css'],
  templateUrl: './lib/components/ApiInfo/api-info.html'
})
export default class ApiInfo extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = this.componentSchema.info;
  }
}
