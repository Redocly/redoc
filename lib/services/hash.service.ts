'use strict';
import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class Hash {
  public value = new BehaviorSubject<string | null>(null);
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
      this.value.next(this.hash);
    });
  }
}
