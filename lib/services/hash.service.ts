'use strict';
import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SpecManager } from '../utils/spec-manager';

@Injectable()
export class Hash {
  public value = new BehaviorSubject<string | null>(null);
  constructor(private specMgr: SpecManager, private location: PlatformLocation) {
    this.bind();

    this.specMgr.spec.subscribe((spec) => {
      if (!spec) return;
      setTimeout(() => {
        this.value.next(this.hash);
      });
    });
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
