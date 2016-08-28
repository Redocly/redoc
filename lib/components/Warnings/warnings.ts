'use strict';

import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SpecManager, BaseComponent } from '../base';
import { WarningsService, OptionsService } from '../../services/index';

@Component({
  selector: 'warnings',
  styleUrls: ['./warnings.css'],
  templateUrl: './warnings.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Warnings extends BaseComponent implements OnInit {
  warnings: Array<string> = [];
  shown: boolean = false;
  suppressWarnings: boolean;
  constructor(specMgr:SpecManager, optionsMgr: OptionsService) {
    super(specMgr);
    this.suppressWarnings = optionsMgr.options.suppressWarnings;
  }

  init() {
    this.shown = !this.suppressWarnings && !!this.warnings.length;
    WarningsService.warnings.subscribe((warns) => {
      this.warnings = warns;
      this.shown = !this.suppressWarnings && !!warns.length;
    });
  }

  close() {
    this.shown = false;
  }

  ngOnInit() {
    this.preinit();
  }
}
