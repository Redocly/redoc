'use strict';

import { SpecManager, RedocComponent, BaseComponent } from '../base';
import { WarningsService, OptionsService } from '../../services/index';

@RedocComponent({
  selector: 'warnings',
  styleUrls: ['./warnings.css'],
  templateUrl: './warnings.html',
  detect: true,
  onPushOnly: false
})
export class Warnings extends BaseComponent {
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
}
