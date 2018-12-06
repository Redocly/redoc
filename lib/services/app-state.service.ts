'use strict';

import { Injectable } from '@angular/core';
import { Subject ,  BehaviorSubject } from 'rxjs';

@Injectable()
export class AppStateService {
  samplesLanguage = new Subject<string>();
  error = new BehaviorSubject<any>(null);
  loading = new Subject<boolean>();
  initialized = new BehaviorSubject<any>(false);
  rightPanelHidden = new BehaviorSubject<any>(false);

  searchContainingPointers = new BehaviorSubject<string|null[]>([]);

  startLoading() {
    this.loading.next(true);
  }

  stopLoading() {
    this.loading.next(false);
  }
}
