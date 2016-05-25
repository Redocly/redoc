'use strict';
import { Injectable } from '@angular/core';
import { isFunction, isString } from '@angular/core/src/facade/lang';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { global } from '@angular/core/src/facade/lang';

const defaults = {
  scrollYOffset: 0,
  disableLazySchemas: false,
  debugMode: false//global && global.redocDebugMode
};

const OPTION_NAMES = new Set(['scrollYOffset', 'disableLazySchemas', 'specUrl']);

@Injectable()
export class OptionsService {
  private _options: any;
  
  constructor(private dom:BrowserDomAdapter) {
    this._options = defaults;
    this.dom = dom;
  }

  get options() {
    return this._options;
  }

  set options(opts) {
    this._options = Object.assign(this._options, opts);
  }

  parseOptions(el) {
    let parsedOpts;
    let attributesMap = this.dom.attributeMap(el);
    parsedOpts = {};
    Array.from(attributesMap.keys())
      //camelCasify
      .map(k => ({
        attrName: k,
        name: k.replace(/-(.)/g,  (m, $1) => $1.toUpperCase())
        })
      )
      .filter(option => OPTION_NAMES.has(option.name))
      .forEach(option => {
        parsedOpts[option.name] = attributesMap.get(option.attrName);
      });

    this.options = parsedOpts;
    this._normalizeOptions();
  }

  _normalizeOptions() {
    // modify scrollYOffset to always be a function
    if (!isFunction(this._options.scrollYOffset)) {
      if (isFinite(this._options.scrollYOffset)) {
        // if number specified create function that returns this value
        let numberOffset = parseFloat(this._options.scrollYOffset);
        this.options.scrollYOffset = () => numberOffset;
      } else {
        // if selector or node function that returns bottom offset of this node
        let el = this._options.scrollYOffset;
        if (!(el instanceof Node)) {
          el = this.dom.query(el);
        }
        if (!el) {
          this._options.scrollYOffset = () => 0;
        } else {
          this._options.scrollYOffset = () => el.offsetTop + el.offsetHeight;
        }
      }
    }

    if (isString(this._options.disableLazySchemas)) this._options.disableLazySchemas = true;
  }
}
