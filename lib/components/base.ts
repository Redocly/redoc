'use strict';
import { OnInit, OnDestroy } from '@angular/core';
import { SpecManager } from '../utils/SpecManager';


export { SpecManager };

function snapshot(obj) {
  if(obj == undefined || typeof(obj) !== 'object') {
    return obj;
  }

  var temp = new obj.constructor();

  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      temp[key] = snapshot(obj[key]);
    }
  }

  return temp;
}

/**
 * Generic Component
 * @class
 */
export class BaseComponent implements OnInit, OnDestroy {
  pointer: string;
  componentSchema: any = null;
  dereferencedCache = {};

  constructor(public specMgr: SpecManager) {
  }

  /**
   * onInit method is run by angular2 after all component inputs are resolved
   */
  ngOnInit() {
    this.componentSchema = this.specMgr.byPointer(this.pointer || '');
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  /**
   * Used to initialize component
   * @abstract
   */
  init() {
    // empty
  }

  /**
   + Used to destroy component
   * @abstract
   */
  destroy() {
    // emtpy
  }
}
