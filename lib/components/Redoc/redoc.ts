'use strict';

import { ElementRef,
  ComponentRef,
  ChangeDetectorRef,
  Input,
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from '@angular/core';

import { BrowserDomAdapter as DOM } from '../../utils/browser-adapter';
import { BaseComponent } from '../base';

import * as detectScollParent from 'scrollparent';

import { SpecManager } from '../../utils/spec-manager';
import { OptionsService, Hash, MenuService, AppStateService } from '../../services/index';
import { CustomErrorHandler } from '../../utils/';

@Component({
  selector: 'redoc',
  templateUrl: './redoc.html',
  styleUrls: ['./redoc.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Redoc extends BaseComponent implements OnInit {
  static _preOptions: any;

  private element: any;

  error: any;
  specLoaded: boolean;
  options: any;

  @Input() specUrl: string;
  @HostBinding('class.loading') specLoading: boolean = false;
  @HostBinding('class.loading-remove') specLoadingRemove: boolean = false;

  constructor(
    specMgr: SpecManager,
    optionsMgr: OptionsService,
    elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private appState: AppStateService
  ) {
    super(specMgr);
    // merge options passed before init
    optionsMgr.options = Redoc._preOptions || {};

    this.element = elementRef.nativeElement;
    //parse options (top level component doesn't support inputs)
    optionsMgr.parseOptions( this.element );
    let scrollParent = detectScollParent( this.element );
    if (scrollParent === DOM.defaultDoc().body) scrollParent = window;
    optionsMgr.options.$scrollParent = scrollParent;
    this.options = optionsMgr.options;
  }

  hideLoadingAnimation() {
    this.specLoadingRemove = true;
    setTimeout(() => {
      this.specLoadingRemove = true;
      this.specLoading = false;
    }, 400);
  }

  load() {
    this.specMgr.load(this.options.specUrl).catch(err => {
      throw err;
    });

    this.specMgr.spec.subscribe((spec) => {
      if (!spec) {
        this.specLoading = true;
        this.specLoaded = false;
      } else {
        this.specLoaded = true;
        this.hideLoadingAnimation();
        this.changeDetector.markForCheck();
      }
    });
  }

  ngOnInit() {
    this.appState.error.subscribe(_err => {
      if (!_err) return;

      if (this.specLoading) {
        this.specLoaded = true;
        this.hideLoadingAnimation();
      }
      this.error = _err;
      this.changeDetector.markForCheck();
      setTimeout(() => {
        this.changeDetector.detectChanges()
      });
    })

    if (this.specUrl) {
      this.options.specUrl = this.specUrl;
    }
    this.load();
  }
}
