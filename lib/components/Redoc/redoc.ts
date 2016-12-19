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
import { OptionsService, Hash, AppStateService, SchemaHelper } from '../../services/index';
import { LazyTasksService } from '../../shared/components/LazyFor/lazy-for';

@Component({
  selector: 'redoc',
  templateUrl: './redoc.html',
  styleUrls: ['./redoc.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class Redoc extends BaseComponent implements OnInit {
  static _preOptions: any;

  private element: HTMLElement;
  private $parent: Element;
  private $refElem: Element;

  error: any;
  specLoaded: boolean;
  options: any;

  loadingProgress: number;

  @Input() specUrl: string;
  @HostBinding('class.loading') specLoading: boolean = false;
  @HostBinding('class.loading-remove') specLoadingRemove: boolean = false;

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
    optionsMgr.options = Redoc._preOptions || {};

    this.element = elementRef.nativeElement;
    this.$parent = this.element.parentElement;
    this.$refElem = this.element.nextElementSibling;

    //parse options (top level component doesn't support inputs)
    optionsMgr.parseOptions( this.element );
    let scrollParent = detectScollParent( this.element );
    if (scrollParent === DOM.defaultDoc().body) scrollParent = window;
    optionsMgr.options.$scrollParent = scrollParent;
    this.options = optionsMgr.options;
    this.lazyTasksService.allSync = !this.options.lazyRendering;
  }

  hideLoadingAnimation() {
    requestAnimationFrame(() => {
      this.specLoadingRemove = true;
      setTimeout(() => {
        this.specLoadingRemove = false;
        this.specLoading = false;
      }, 400);
    });
  }

  showLoadingAnimation() {
    this.specLoading = true;
    this.specLoadingRemove = false;
  }

  load() {
    this.specMgr.load(this.options.specUrl).catch(err => {
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
        this.changeDetector.markForCheck();
        this.changeDetector.detectChanges();
        this.specLoaded = true;
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
