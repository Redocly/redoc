'use strict';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CORE_DIRECTIVES, JsonPipe, AsyncPipe } from '@angular/common';
import { SpecManager } from '../utils/SpecManager';
import { MarkedPipe, JsonPointerEscapePipe, SafePipe } from '../utils/pipes';

export { SpecManager };

// common inputs for all components
let commonInputs = ['pointer']; // json pointer to the schema chunk

// internal helper function
function safeConcat(a, b) {
  let res = a && a.slice() || [];
  b = (b == undefined) ? [] : b;
  return res.concat(b);
}

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
 * Class decorator
 * Simplifies setup of component metainfo
 * All options are options from either Component or View angular2 decorator
 * For detailed info look angular2 doc
 * @param {Object} options - component options
 * @param {string[]} options.inputs - component inputs
 * @param {*[]} options.directives - directives used by component
 *   (except CORE_DIRECTIVES)
 * @param {*[]} options.pipes - pipes used by component
 * @param {*[]} options.providers - component providers
 * @param {string} options.templateUrl - path to component template
 * @param {string} options.template - component template html
 * @param {string} options.styles - component css styles
 */
export function RedocComponent(options) {
  let inputs = safeConcat(options.inputs, commonInputs);
  let directives = safeConcat(options.directives, CORE_DIRECTIVES);
  let pipes = safeConcat(options.pipes, [JsonPointerEscapePipe, MarkedPipe, JsonPipe, AsyncPipe, SafePipe]);
  if (options.onPushOnly === undefined) options.onPushOnly = true;

  return function decorator(target) {

    let componentDecorator = Component({
      selector: options.selector,
      inputs: inputs,
      outputs: options.outputs,
      providers: options.providers,
      changeDetection: options.onPushOnly ? ChangeDetectionStrategy.OnPush : ChangeDetectionStrategy.Default,
      animations: options.animations,
      templateUrl: options.templateUrl,
      template: options.template,
      styles: options.styles,
      directives: directives,
      pipes: pipes
    });

    return componentDecorator(target) || target;
  };
}

/**
 * Generic Component
 * @class
 */
export class BaseComponent implements OnInit, OnDestroy {
  componentSchema: any = null;
  pointer: String;
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
