'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {MethodsList} from '../MethodsList/methods-list';

@RedocComponent({
  selector: 'paths-list',
  templateUrl: './lib/components/PathsList/paths-list.html',
  directives: [MethodsList]
})
export class PathsList extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    this.data.paths = Object.keys(this.componentSchema.paths);
  }
}
