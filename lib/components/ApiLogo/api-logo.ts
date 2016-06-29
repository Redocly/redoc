'use strict';

import {RedocComponent, BaseComponent, SpecManager} from '../base';

@RedocComponent({
  selector: 'api-logo',
  styleUrls: ['./api-logo.css'],
  templateUrl: './api-logo.html'
})
export class ApiLogo extends BaseComponent {
  data:any = {};

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  prepareModel() {
    let logoInfo = this.componentSchema.info['x-logo'];
    if (!logoInfo) return;
    this.data.imgUrl = logoInfo.url;
    this.data.bgColor = logoInfo.backgroundColor || 'transparent';
  }
}
