'use strict';

import {SchemaManager, RedocComponent, BaseComponent} from '../base';
import OptionsManager from '../../options';

@RedocComponent({
  selector: 'api-info',
  styleUrls: ['./lib/components/ApiInfo/api-info.css'],
  templateUrl: './lib/components/ApiInfo/api-info.html'
})
@Reflect.metadata('parameters', [[SchemaManager], [OptionsManager]])
export default class ApiInfo extends BaseComponent {
  constructor(schemaMgr, optionsMgr) {
    super(schemaMgr);
    this.optionsMgr = optionsMgr;
  }

  prepareModel() {
    this.data = this.componentSchema.info;
    this.specUrl = this.optionsMgr.options.specUrl;
  }
}
