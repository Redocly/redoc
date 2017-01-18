'use strict';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppStateService {
  samplesLanguage = new Subject<string>();
  error = new BehaviorSubject<any>(null);
  loading = new Subject<boolean>();
  initialized = new BehaviorSubject<any>(false);

  searchContainingPointers = new BehaviorSubject<string[]>([]);

  startLoading() {
    this.loading.next(true);
  }

  stopLoading() {
    this.loading.next(false);
  }
}
