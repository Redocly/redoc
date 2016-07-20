'use strict';

import { forwardRef } from '@angular/core';
import { RedocComponent, BaseComponent, SpecManager } from '../base';
import { Method } from '../Method/method';
import { EncodeURIComponentPipe } from '../../utils/pipes';
import { SchemaHelper } from '../../services/index';

@RedocComponent({
  selector: 'methods-list',
  templateUrl: './methods-list.html',
  styleUrls: ['./methods-list.css'],
  directives: [ forwardRef(() => Method) ],
  pipes: [ EncodeURIComponentPipe ],
  detect: true
})
export class MethodsList extends BaseComponent {
  tags:Array<any>;
  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    this.tags = [];
    // follow SwaggerUI behavior for cases when one method has more than one tag:
    // duplicate methods

    let tags = SchemaHelper.buildMenuTree(this.specMgr.schema);
    tags.forEach(tagInfo => {
      // inject tag name into method info
      tagInfo.methods = tagInfo.methods || [];
      tagInfo.methods.forEach(method => {
        method.tag = tagInfo.name;
      });
    });
    this.tags = tags;
  }

  trackByPointer(idx, el) {
    return el.pointer;
  }

  trackByTagName(idx, el) {
    return el.name;
  }
}
