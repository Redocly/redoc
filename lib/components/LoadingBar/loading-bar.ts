'use strict';
import { Input, HostBinding, Component, OnInit, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core';
import JsonPointer from '../../utils/JsonPointer';
import { BaseComponent, SpecManager } from '../base';
import { SchemaHelper } from '../../services/schema-helper.service';
import { OptionsService, AppStateService } from '../../services/';

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
  `],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingBar {
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
