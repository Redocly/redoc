import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';


@Injectable()
export class SearchService {
  constructor(private app: AppStateService) {
    window['locator'] = this;
  }
  ensureSearchVisible(containingPointers: string[]) {
    this.app.searchContainingPointers.next(containingPointers);
  }
}
