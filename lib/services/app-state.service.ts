'use strict';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppStateService {
  samplesLanguage = new Subject<string>();
  error = new BehaviorSubject<any>(null);
}
