'use strict';
import { Input, HostBinding, Component, OnChanges } from '@angular/core';

@Component({
  selector: 'loading-bar',
  template: `
  <span [style.width]='progress + "%"'> </span>
  `,
  styleUrls: ['loading-bar.css']
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
