'use strict';
import { Injectable } from '@angular/core';
import { isFunction, isString } from '../utils/helpers';
import { BrowserDomAdapter as DOM } from '../utils/browser-adapter';

const defaults = {
  scrollYOffset: 0,
  disableLazySchemas: false
};

const OPTION_NAMES = new Set([
  'scrollYOffset',
  'disableLazySchemas',
  'specUrl',
  'suppressWarnings',
  'hideHostname',
  'lazyRendering',
  'expandResponses',
  'requiredPropsFirst',
  'noAutoAuth',
  'pathInMiddlePanel',
  'untrustedSpec',
  'hideLoading',
  'hideDownloadButton',
  'ignoredHeaderParameters',
  'nativeScrollbars',
]);

export interface Options {
  scrollYOffset?: any;
  disableLazySchemas?: boolean;
  specUrl?: string;
  suppressWarnings?: boolean;
  hideHostname?: boolean;
  hideDownloadButton?: boolean;
  lazyRendering?: boolean;
  expandResponses?: Set<string> | 'all';
  $scrollParent?: HTMLElement | Window;
  requiredPropsFirst?: boolean;
  noAutoAuth?: boolean;
  pathInMiddlePanel?: boolean;
  untrustedSpec?: boolean;
  hideLoading?: boolean;
  spec?: any;
  ignoredHeaderParameters?: string[];
  nativeScrollbars?: boolean;
}

@Injectable()
export class OptionsService {
  private _options: Options;

  constructor() {
    this._options = defaults;
    this._normalizeOptions();
  }

  get options(): Options {
    return this._options;
  }

  set options(opts:Options) {
    this._options = Object.assign(this._options, opts);
  }

  parseOptions(el:HTMLElement):void {
    let parsedOpts;
    let attributesMap = DOM.attributeMap(el);
    parsedOpts = {};
    Array.from(attributesMap.keys())
      //camelCasify
      .map(k => ({
        attrName: k,
        name: k.replace(/-(.)/g,  (_, $1) => $1.toUpperCase())
        })
      )
      .filter(option => OPTION_NAMES.has(option.name))
      .forEach(option => {
        parsedOpts[option.name] = attributesMap.get(option.attrName);
      });

    this.options = parsedOpts;
    this._normalizeOptions();
  }

  _normalizeOptions(): void {
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
    if (isString(this._options.hideHostname)) this._options.hideHostname = true;
    if (isString(this._options.hideDownloadButton)) this._options.hideDownloadButton = true;
    if (isString(this._options.lazyRendering)) this._options.lazyRendering = true;
    if (isString(this._options.requiredPropsFirst)) this._options.requiredPropsFirst = true;
    if (isString(this._options.noAutoAuth)) this._options.noAutoAuth = true;
    if (isString(this._options.pathInMiddlePanel)) this._options.pathInMiddlePanel = true;
    if (isString(this._options.untrustedSpec)) this._options.untrustedSpec = true;
    if (isString(this._options.hideLoading)) this._options.hideLoading = true;
    if (isString(this._options.nativeScrollbars))
      this._options.nativeScrollbars = true;
    if (isString(this._options.expandResponses)) {
      let str = this._options.expandResponses as string;
      if (str === 'all') return;
      this._options.expandResponses = new Set(str.split(','));
    }
  }
}
