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
  warnings: Array<string>;
  shown: boolean;
  constructor(specMgr:SpecManager, optionsMgr: OptionsService) {
    super(specMgr);
    this.shown = !optionsMgr.options.suppressWarnings;
  }

  init() {
    WarningsService.warnings.subscribe((warns) => {
      this.warnings = warns;
    });
  }

  close() {
    this.shown = false;
  }
}
