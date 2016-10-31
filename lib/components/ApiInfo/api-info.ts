'use strict';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';
import { OptionsService, MenuService } from '../../services/index';

@Component({
  selector: 'api-info',
  styleUrls: ['./api-info.css'],
  templateUrl: './api-info.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiInfo extends BaseComponent implements OnInit {
  info: any = {};
  specUrl: String;
  constructor(specMgr: SpecManager, private optionsService: OptionsService) {
    super(specMgr);
  }

  init() {
    this.info = this.componentSchema.info;
    this.specUrl = this.optionsService.options.specUrl;
    if (!isNaN(parseInt(this.info.version.substring(0, 1)))) {
      this.info.version = 'v' + this.info.version;
    }
  }

  ngOnInit() {
    this.preinit();
  }
}
