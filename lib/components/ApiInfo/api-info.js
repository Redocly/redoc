'use strict';

import { SchemaManager, RedocComponent, BaseComponent } from '../base';
import { OptionsService } from '../../services/index';

@RedocComponent({
  selector: 'api-info',
  styleUrls: ['./lib/components/ApiInfo/api-info.css'],
  templateUrl: './lib/components/ApiInfo/api-info.html'
})
@Reflect.metadata('parameters', [[SchemaManager], [OptionsService]])
export class ApiInfo extends BaseComponent {
  constructor(schemaMgr, optionsService) {
    super(schemaMgr);
    this.optionsService = optionsService;
  }

  prepareModel() {
    this.data = this.componentSchema.info;
    this.specUrl = this.optionsService.options.specUrl;
  }
}
