import { Component } from '@angular/core';

import { RedocView } from './redoc-view';

const CAFE =
  'https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml';

@Component({
  selector: 'app-root',
  imports: [RedocView],
  template: '<app-redoc-view [specUrl]="cafe" />',
})
export class App {
  readonly cafe = CAFE;
}
