'use strict';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { BrowserDomAdapter as DOM } from '../utils/browser-adapter';
import { global } from '@angular/core/src/facade/lang';

import { RedocEventsService } from './events.service';

@Injectable()
export class Hash {
  @Output() changed = new EventEmitter();
  private _cancel: any;
  constructor(private events:RedocEventsService) {
    this.bind();

    events.bootstrapped.subscribe(() => this.changed.next(this.hash));
  }

  get hash() {
    return DOM.getLocation().hash;
  }

  bind() {
    this._cancel = DOM.onAndCancel(global, 'hashchange', (evt) => {
      this.changed.next(this.hash);
      evt.preventDefault();
    });
  }

  unbind() {
    this._cancel();
  }
}
