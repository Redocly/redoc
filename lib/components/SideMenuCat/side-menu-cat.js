'use strict';

import {RedocComponent, BaseComponent} from '../base';
import {EventEmitter} from 'angular2/angular2';

@RedocComponent({
  selector: 'side-menu-cat',
  inputs: ['catDetails'],
  outputs: ['expand', 'activate'],
  styleUrls: ['./lib/components/SideMenuCat/side-menu-cat.css'],
  templateUrl: './lib/components/SideMenuCat/side-menu-cat.html'
})
export class SideMenuCat extends BaseComponent {
  constructor(schemaMgr) {
    super(schemaMgr);
    this.expand = new EventEmitter();
    this.activate = new EventEmitter();
  }

  expandCat() {
    this.expand.next();
  }

  activateMethod(methodIdx) {
    this.activate.next({methodIdx: methodIdx});
  }

  prepareModel() {
    this.data = this.catDetails;
  }
}
