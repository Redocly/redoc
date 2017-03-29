import { ErrorHandler, Injectable } from '@angular/core';
import { AppStateService } from '../services/app-state.service';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  constructor(private appState: AppStateService) {
    super();
  }
  handleError(error) {
    this.appState.error.next(error && error.rejection || error);
    super.handleError(error);
  }
}
