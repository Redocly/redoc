'use strict';

import {Component, View} from 'angular2/angular2';

@Component({selector: 'redoc-test'})
@View({
  templateUrl: './lib/RedocTest/redoc-test.html',
  styleUrls: ['./lib/RedocTest/redoc-test.css']
})
// Component controller
export class RedocTest {
  constructor() {
    this.name = 'ReDoc';
  }
}
