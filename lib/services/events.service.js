'use strict';

import { EventEmitter } from '@angular/core';

export class RedocEventsService {
  constructor() {
    this.bootstrapped = new EventEmitter();
    this.samplesLanguageChanged = new EventEmitter();
  }
}
