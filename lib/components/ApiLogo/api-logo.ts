'use strict';

import {RedocComponent, BaseComponent, SpecManager} from '../base';

@RedocComponent({
  selector: 'api-logo',
  styleUrls: ['./api-logo.css'],
  templateUrl: './api-logo.html'
})
export class ApiLogo extends BaseComponent {
  logo:any = {};

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    let logoInfo = this.componentSchema.info['x-logo'];
    if (!logoInfo) return;
    this.logo.imgUrl = logoInfo.url;
    this.logo.bgColor = logoInfo.backgroundColor || 'transparent';
  }
}
