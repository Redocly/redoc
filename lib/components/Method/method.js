'use strict';

import {JsonPointer} from '../../utils/JsonPointer';
import {RedocComponent, BaseComponent} from '../base';

@RedocComponent({
  selector: 'method',
  templateUrl: './lib/components/Method/method.html'
})
export class Method extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    this.data.method = JsonPointer.baseName(this.pointer);
    this.data.path = JsonPointer.baseName(this.pointer, 2);
    this.data.methodInfo = this.componentSchema;
  }
}
