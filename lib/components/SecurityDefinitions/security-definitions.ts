'use strict';
import { Component, ChangeDetectionStrategy, OnInit, HostListener } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';

import { ComponentParser } from '../../services/';

const AUTH_TYPES = {
  'oauth2': 'OAuth2',
  'apiKey': 'API Key',
  'basic': 'Basic Authorization'
}

@Component({
  selector: 'security-definitions',
  styleUrls: ['./security-definitions.css'],
  templateUrl: './security-definitions.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecurityDefinitions extends BaseComponent implements OnInit {
  info: any = {};
  specUrl: String;
  defs: any[];

  static insertTagIntoDescription(md:string) {
    if (ComponentParser.contains(md, 'security-definitions')) return md;
    if (/^#\s?Authentication\s*$/mi.test(md)) return md;
    return md + '\n# Authentication \n' + ComponentParser.build('security-definitions');
  }

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    this.componentSchema = this.componentSchema.securityDefinitions;
    this.defs = Object.keys(this.componentSchema).map(name => {
      let details = this.componentSchema[name];
      details._displayType = AUTH_TYPES[details.type];
      return {
        name,
        details
      }
    });

  }

  ngOnInit() {
    this.preinit();
  }
}
