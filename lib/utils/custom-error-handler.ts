import { ErrorHandler, Injectable } from '@angular/core';
import { AppStateService } from '../services/app-state.service';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  constructor(private appState: AppStateService) {
    super(true);
  }
  handleError(error) {
    this.appState.error.next(error);
    super.handleError(error);
  }
}
