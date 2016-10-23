import { ErrorHandler, Injectable } from '@angular/core';
import { AppStateService } from '../services/app-state.service';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {
  constructor(private appState: AppStateService) {
  }
  handleError(error) {
    console.log(error);
    this.appState.error.next(error);
  }
}
