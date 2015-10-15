'use strict';

import {RedocComponent, BaseComponent} from '../base';

@RedocComponent({
  selector: 'side-menu-cat',
  inputs: ['catDetails'],
  styleUrls: ['./lib/components/SideMenuCat/side-menu-cat.css'],
  templateUrl: './lib/components/SideMenuCat/side-menu-cat.html'
})
export class SideMenuCat extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
  }

  prepareModel() {
    this.data = this.catDetails;
  }
}
