'use strict';
import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/index';

@Component({
  selector: 'methods-list',
  templateUrl: './methods-list.html',
  styleUrls: ['./methods-list.css']
})
export class MethodsList extends BaseComponent implements OnInit {
  @Input() pointer:string;

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
        method.tag = tagInfo.id;
      });
    });
  }

  trackByPointer(idx, el) {
    return el.pointer;
  }

  trackByTagName(idx, el) {
    return el.name;
  }

  ngOnInit() {
    this.preinit();
  }
}
