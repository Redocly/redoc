'use strict';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';

import { ComponentParser } from '../../services/component-parser.service';



@Component({
  selector: 'x-permissions',
  styleUrls: ['./x-permissions.css'],
  templateUrl: './x-permissions.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XPermissions extends BaseComponent implements OnInit {
  info: any = {};
  specUrl: String;
  defs: any[];

  static insertTagIntoDescription(md:string) {
    if (ComponentParser.contains(md, 'x-permissions')) return md;
    if (/^#\s?Permissions\s*$/mi.test(md)) return md;
    return md + '\n\n# Permissions \n' + ComponentParser.build('x-permissions');
  }

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    this.componentSchema = this.componentSchema['x-permissions'];
    this.defs = Object.keys(this.componentSchema).map(name => {
      let details = this.componentSchema[name];
      let title = details.title ? details.title : name;
      details.description = details.description ? details.description : 'none';
      return {
        name,
        title,
        details
      };
    });

  }

  ngOnInit() {
    this.preinit();
  }
}
