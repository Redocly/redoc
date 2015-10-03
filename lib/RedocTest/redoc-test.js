import {Component, View} from 'angular2/angular2';

@Component({selector: 'redoc-test'})
@View({template: '<h1>Hello {{ name }}!</h1>'})
// Component controller
export class RedocTest {
  constructor() {
    this.name = 'ReDoc';
  }
}
