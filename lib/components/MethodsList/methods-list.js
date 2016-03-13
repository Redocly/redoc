'use strict';

import {RedocComponent, BaseComponent} from '../base';
import Method from '../Method/method';
import {EncodeURIComponentPipe} from '../../utils/pipes';

@RedocComponent({
  selector: 'methods-list',
  templateUrl: './lib/components/MethodsList/methods-list.html',
  styleUrls: ['./lib/components/MethodsList/methods-list.css'],
  directives: [Method],
  pipes: [EncodeURIComponentPipe]
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
    let tags = Array.from(menuStructure.entries())
      .map((entry) => {
        let [tag, {description, methods}] = entry;
        // inject tag name into method info
        methods = methods || [];
        methods.forEach(method => {
          method.tag = tag;
        });
        return {
          name: tag,
          description: description,
          methods: methods
        };
      });
    this.data.tags = tags;
    // TODO: check $ref field
  }
}
