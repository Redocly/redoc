'use strict';
import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class Hash {
  public value = new BehaviorSubject<string | null>(null);
  private noEmit:boolean = false;
  constructor(private location: PlatformLocation) {
    this.bind();
  }

  start() {
    this.value.next(this.hash);
  }

  get hash() {
    return this.location.hash;
  }

  bind() {
    this.location.onHashChange(() => {
      if (this.noEmit) return;
      this.value.next(this.hash);
    });
  }

  update(hash: string|null, rewriteHistory:boolean = false) {
    if (hash == undefined) return;
    if (rewriteHistory) {
      window.history.replaceState(null, '', window.location.href.split('#')[0] + '#' + hash);
      return;
    }
    this.noEmit = true;
    window.location.hash = hash;
    setTimeout(() => {
      this.noEmit = false;
    });
  }
}
