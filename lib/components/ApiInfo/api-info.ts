'use strict';

import { SpecManager, RedocComponent, BaseComponent } from '../base';
import { OptionsService, MenuService } from '../../services/index';

@RedocComponent({
  selector: 'api-info',
  styleUrls: ['./api-info.css'],
  templateUrl: './api-info.html'
})
export class ApiInfo extends BaseComponent {
  info: any;
  specUrl: String;
  constructor(specMgr:SpecManager, private optionsService:OptionsService, private menuServ: MenuService) {
    super(specMgr);
  }

  init() {
    this.info = this.componentSchema.info;
    this.specUrl = this.optionsService.options.specUrl;
    if (parseInt(this.info.version.substring(0, 1)) !== NaN) {
      this.info.version = 'v' + this.info.version;
    }
  }
}
