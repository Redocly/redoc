'use strict';

import { EventEmitter, Output } from '@angular/core';

export class RedocEventsService {
  @Output() bootstrapped = new EventEmitter();
  @Output() samplesLanguageChanged = new EventEmitter();
}
