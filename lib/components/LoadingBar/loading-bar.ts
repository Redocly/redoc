'use strict';
import { Input, HostBinding, Component, OnChanges } from '@angular/core';

@Component({
  selector: 'loading-bar',
  template: `
  <span [style.width]='progress + "%"'> </span>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      display: block;

      height: 5px;
      z-index: 100;
    }

    span {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: attr(progress percentage);
      background-color: #5f7fc3;
      transition: right 0.2s linear;
    }
  `]
})
export class LoadingBar implements OnChanges {
  @Input() progress:number = 0;
  @HostBinding('style.display') display = 'block';

  ngOnChanges(ch) {
    if (ch.progress.currentValue === 100) {
      setTimeout(() => {
        this.display = 'none';
      }, 500);
    }
  }
}
