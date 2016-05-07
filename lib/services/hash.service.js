'use strict';
import { Injectable, EventEmitter } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { global } from '@angular/core/src/facade/lang';

import { RedocEventsService } from './events.service.js';

@Reflect.metadata('parameters', [[BrowserDomAdapter], [RedocEventsService]])
@Injectable()
export class Hash {
  constructor(dom, events) {
    this.changed = new EventEmitter();
    this.dom = dom;
    this.bind();

    events.bootstrapped.subscribe(() => this.changed.next(this.hash));
  }

  get hash() {
    return this.dom.getLocation().hash;
  }

  bind() {
    this._cancel = this.dom.onAndCancel(global, 'hashchange', (evt) => {
      this.changed.next(this.hash);
      evt.preventDefault();
    });
  }

  unbind() {
    this._cancel();
  }
}
