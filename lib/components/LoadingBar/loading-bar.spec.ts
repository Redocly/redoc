'use strict';

import {
  Component
} from '@angular/core';

import {
  ComponentFixture,
  inject,
  fakeAsync,
  tick,
  TestBed,
} from '@angular/core/testing';

import { getChildDebugElement } from '../../../tests/helpers';
import { LoadingBar } from './loading-bar';

describe('Redoc components', () => {
  describe('Loading Bar', () => {
    let component: LoadingBar;

    it('should init component', () => {
      let fixture = TestBed.createComponent(LoadingBar);
      component = fixture.componentInstance;
      fixture.detectChanges();
      should.exist(component);
      component.progress.should.be.equal(0);
      component.display.should.be.equal('block');
    });

    it('should hide itself in 500ms if progress is 100', fakeAsync(() => {
      TestBed.configureTestingModule({ declarations: [ TestAppComponent ] });
      let fixture = TestBed.createComponent(TestAppComponent);
      let parentComp = fixture.componentInstance;
      component = getChildDebugElement(fixture.debugElement, 'loading-bar').componentInstance;
      // need to pass update through parent component as ngOnChanges is run only for view changes
      parentComp.progress = 50;
      fixture.detectChanges();
      parentComp.progress = 100;
      fixture.detectChanges();

      component.display.should.be.equal('block');
      tick(500);
      component.display.should.be.equal('none');
    }));
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  template:
      `<loading-bar [progress]="progress"></loading-bar>`
})
class TestAppComponent {
  progress = 0;
}
