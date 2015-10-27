'use strict';

import {RedocComponent, BaseComponent} from '../base';
import Method from '../Method/method';

@RedocComponent({
  selector: 'methods-list',
  templateUrl: './lib/components/MethodsList/methods-list.html',
  styleUrls: ['./lib/components/MethodsList/methods-list.css'],
  directives: [Method]
})
export default class MethodsList extends BaseComponent {

  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = {};
    // follow SwaggerUI behavior for cases when one method has more than one tag:
    // duplicate methods

    let menuStructure = this.schemaMgr.buildMenuTree();
    let methods = Array.from(menuStructure.entries())
      .map((entry) => {
        let [tag, methods] = entry;
        // inject tag name into method info
        methods.forEach(method => {
          method.tag = tag;
        });
        return methods;
      })
      // join arrays
      .reduce((a, b) => a.concat(b));
    this.data.methods = methods;
    // TODO: check $ref field
  }
}
