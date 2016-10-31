'use strict';
import { Injectable } from '@angular/core';
import { isFunction, isString } from '../utils/helpers';
import { BrowserDomAdapter as DOM } from '../utils/browser-adapter';

const defaults = {
  scrollYOffset: 0,
  disableLazySchemas: false
};

const OPTION_NAMES = new Set(['scrollYOffset', 'disableLazySchemas', 'specUrl', 'suppressWarnings']);

@Injectable()
export class OptionsService {
  private _options: any;

  constructor() {
    this._options = defaults;
  }

  get options() {
    return this._options;
  }

  set options(opts) {
    this._options = Object.assign(this._options, opts);
  }

  parseOptions(el) {
    let parsedOpts;
    let attributesMap = DOM.attributeMap(el);
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
          el = DOM.query(el);
        }
        if (!el) {
          this._options.scrollYOffset = () => 0;
        } else {
          this._options.scrollYOffset = () => el.offsetTop + el.offsetHeight;
        }
      }
    }

    if (isString(this._options.disableLazySchemas)) this._options.disableLazySchemas = true;
    if (isString(this._options.suppressWarnings)) this._options.suppressWarnings = true;
  }
}
