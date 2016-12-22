'use strict';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/index';

@Component({
  selector: 'methods-list',
  templateUrl: './methods-list.html',
  styleUrls: ['./methods-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MethodsList extends BaseComponent implements OnInit {
  @Input() pointer:string;

  tags:Array<any> = [];

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    let flatMenuItems = SchemaHelper.flatMenu(SchemaHelper.buildMenuTree(this.specMgr.schema));
    this.tags = [];
    let emptyTag = {
      name: '',
      items: []
    }
    flatMenuItems.forEach(menuItem => {
      if (!menuItem.metadata) return;

      if (menuItem.metadata.type === 'tag') {
        this.tags.push(menuItem);
      }
      if (menuItem.metadata.type === 'method' && !menuItem.parent) {
        emptyTag.items.push(menuItem);
      }
    });
    if (emptyTag.items.length) this.tags.push(emptyTag);
  }

  trackByTagName(_, el) {
    return el.name;
  }

  ngOnInit() {
    this.preinit();
  }
}
