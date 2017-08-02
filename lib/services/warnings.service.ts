'use strict';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WarningsService {
  public static warnings = new BehaviorSubject<Array<string>>([]);

  private static _warnings: Array<string> = [];

  static hasWarnings() {
    return !!WarningsService._warnings.length;
  }

  static warn(message:string) {
    WarningsService._warnings.push(message);
    WarningsService.warnings.next(WarningsService._warnings);
    console.warn(message);
  }
}
