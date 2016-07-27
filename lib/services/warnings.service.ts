'use strict';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class WarningsService {
  private static _warnings: Array<string> = [];
  private static _warningsObs = new Subject<Array<string>>();

  static get warnings() {
    return WarningsService._warningsObs;
  }

  static hasWarnings() {
    return !!WarningsService._warnings.length;
  }

  static warn(message:string) {
    WarningsService._warnings.push(message);
    WarningsService._warningsObs.next(WarningsService._warnings);
    console.warn(message);
  }
}
