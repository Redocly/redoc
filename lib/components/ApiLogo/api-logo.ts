'use strict';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BaseComponent, SpecManager } from '../base';

@Component({
  selector: 'api-logo',
  styleUrls: ['./api-logo.css'],
  templateUrl: './api-logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiLogo extends BaseComponent implements OnInit {
  logo:any = {};

  constructor(specMgr:SpecManager) {
    super(specMgr);
  }

  init() {
    const info = this.componentSchema.info;
    const logoInfo = info['x-logo'];
    if (!logoInfo) return;
    this.logo.imgUrl = logoInfo.url;
    this.logo.bgColor = logoInfo.backgroundColor || 'transparent';
    this.logo.url = info.contact && info.contact.url || null;
  }

  ngOnInit() {
    this.preinit();
  }
}
