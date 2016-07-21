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
  tags:Array<any> = [];
  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    let tags = SchemaHelper.buildMenuTree(this.specMgr.schema);
    this.tags = tags.filter(tagInfo => !tagInfo.virtual);
    this.tags.forEach(tagInfo => {
      // inject tag name into method info
      tagInfo.methods = tagInfo.methods || [];
      tagInfo.methods.forEach(method => {
        method.tag = tagInfo.name;
      });
    });
  }

  trackByPointer(idx, el) {
    return el.pointer;
  }

  trackByTagName(idx, el) {
    return el.name;
  }
}
