'use strict';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { global } from '@angular/core/src/facade/lang';

import { RedocEventsService } from './events.service';

@Injectable()
export class Hash {
  @Output() changed = new EventEmitter();
  private _cancel: any;
  constructor(private dom:BrowserDomAdapter, private events:RedocEventsService) {
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
