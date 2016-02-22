'use strict';

import {RedocComponent, BaseComponent} from '../base';

@RedocComponent({
  selector: 'api-logo',
  styleUrls: ['./lib/components/ApiLogo/api-logo.css'],
  templateUrl: './lib/components/ApiLogo/api-logo.html'
})
export default class ApiLogo extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    let logoInfo = this.componentSchema.info['x-logo'];
    if (!logoInfo) return;
    this.data.imgUrl = logoInfo.url;
    this.data.bgColor = logoInfo.backgroundColor || 'transparent';
  }
}
