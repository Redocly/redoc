'use strict';

export var options = {
  scrollYOffset: 0
};

// singleton
export default class OptionsManager {
  constructor() {
    if (OptionsManager.prototype._instance) {
      return OptionsManager.prototype._instance;
    }

    OptionsManager.prototype._instance = this;

    this._defaults = {
      scrollYOffset: 0,
      disableLazySchemas: false
    };

    this._options = {};
  }

  static instance() {
    return new OptionsManager();
  }

  get options() {
    return this._options;
  }

  set options(opts) {
    this._options = Object.assign({}, this._defaults, opts);
  }
}
