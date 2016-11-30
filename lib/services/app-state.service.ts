'use strict';

import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injector } from '@angular/core';

@Injectable()
export class AppStateService {
  samplesLanguage = new Subject<string>();
  error = new BehaviorSubject<any>(null);
  loading = new Subject<boolean>();

  startLoading() {
    this.loading.next(true);
  }

  stopLoading() {
    this.loading.next(false);
  }

  constructor(private injector: Injector, private zone: NgZone) {
  }
}
