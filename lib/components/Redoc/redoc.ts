'use strict';

import { ElementRef,
  ChangeDetectorRef,
  Input,
  Component,
  OnInit,
  OnDestroy,
  HostBinding
} from '@angular/core';

import { BrowserDomAdapter as DOM } from '../../utils/browser-adapter';
import { BaseComponent } from '../base';

import * as detectScollParent from 'scrollparent';

import { SpecManager } from '../../utils/spec-manager';
import {
  SearchService,
  OptionsService,
  Options,
  Hash,
  AppStateService,
  SchemaHelper,
  MenuService,
  Marker
} from '../../services/';
import { LazyTasksService } from '../../shared/components/LazyFor/lazy-for';

function getPreOptions() {
  return Redoc._preOptions || {};
}

@Component({
  selector: 'redoc',
  templateUrl: './redoc.html',
  styleUrls: ['./redoc.css'],
  providers: [
    SpecManager,
    MenuService,
    SearchService,
    LazyTasksService,
    Marker
  ]
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class Redoc extends BaseComponent implements OnInit {
  static _preOptions: any = {};

  error: any;
  specLoaded: boolean;
  options: Options;

  loadingProgress: number;

  @Input() specUrl: string;
  @HostBinding('class.loading') specLoading: boolean = false;
  @HostBinding('class.loading-remove') specLoadingRemove: boolean = false;

  private element: HTMLElement;
  private $parent: Element;
  private $refElem: Element;

  constructor(
    specMgr: SpecManager,
    optionsMgr: OptionsService,
    elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private appState: AppStateService,
    private lazyTasksService: LazyTasksService,
    private hash: Hash
  ) {
    super(specMgr);
    SchemaHelper.setSpecManager(specMgr);
    // merge options passed before init
    optionsMgr.options = getPreOptions();

    this.element = elementRef.nativeElement;
    this.$parent = this.element.parentNode as Element;
    this.$refElem = this.element.nextElementSibling;

    //parse options (top level component doesn't support inputs)
    optionsMgr.parseOptions( this.element );
    let scrollParent = detectScollParent( this.element );
    if (scrollParent === (document.scrollingElement || document.documentElement)) scrollParent = window;
    optionsMgr.options.$scrollParent = scrollParent;
    this.options = optionsMgr.options;
    this.lazyTasksService.allSync = !this.options.lazyRendering;
  }

  hideLoadingAnimation() {
    if (this.options.hideLoading) {
      return
    }
    requestAnimationFrame(() => {
      this.specLoadingRemove = true;
      setTimeout(() => {
        this.specLoadingRemove = false;
        this.specLoading = false;
      }, 400);
    });
  }

  showLoadingAnimation() {
    if (this.options.hideLoading) {
      return
    }
    this.specLoading = true;
    this.specLoadingRemove = false;
  }

  load() {
    // bunlde spec directly if passsed or load by URL
    this.specMgr.load(this.options.spec || this.options.specUrl).catch(err => {
      throw err;
    });

    this.appState.loading.subscribe(loading => {
      if (loading) {
        this.showLoadingAnimation();
      } else {
        this.hideLoadingAnimation();
      }
    });

    this.specMgr.spec.subscribe((spec) => {
      if (!spec) {
        this.appState.startLoading();
      } else {
        this.specLoaded = true;
        this.changeDetector.markForCheck();
        this.changeDetector.detectChanges();
        setTimeout(() => {
          this.hash.start();
        });
      }
    });
  }

  ngOnInit() {
    this.lazyTasksService.loadProgress.subscribe(progress => this.loadingProgress = progress)
    this.appState.error.subscribe(_err => {
      if (!_err) return;

      this.appState.stopLoading();

      if (this.loadingProgress === 100) return;
      this.error = _err;
      this.changeDetector.markForCheck();
    });

    if (this.specUrl) {
      this.options.specUrl = this.specUrl;
    }
    this.load();
  }

  ngOnDestroy() {
    let $clone = this.element.cloneNode();
    this.$parent.insertBefore($clone, this.$refElem);
  }
}
