'use strict';

import { SpecManager, RedocComponent, BaseComponent } from '../base';
import { OptionsService } from '../../services/index';

@RedocComponent({
  selector: 'api-info',
  styleUrls: ['./api-info.css'],
  templateUrl: './api-info.html'
})
export class ApiInfo extends BaseComponent {
  data: any;
  specUrl: String;
  constructor(schemaMgr:SpecManager, private optionsService:OptionsService) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = this.componentSchema.info;
    this.specUrl = this.optionsService.options.specUrl;
  }
}
