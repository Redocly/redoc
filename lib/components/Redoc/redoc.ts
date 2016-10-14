'use strict';

import { ElementRef, ComponentRef, ChangeDetectorRef, Input,
  Component, OnInit, ChangeDetectionStrategy} from '@angular/core';

import { BrowserDomAdapter as DOM } from '../../utils/browser-adapter';
import { BaseComponent } from '../base';

import * as detectScollParent from 'scrollparent';

import { SpecManager } from '../../utils/SpecManager';
import { OptionsService, RedocEventsService } from '../../services/index';

@Component({
  selector: 'redoc',
  templateUrl: './redoc.html',
  styleUrls: ['./redoc.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Redoc extends BaseComponent implements OnInit {
  static appRef: ComponentRef<any>;
  static _preOptions: any;
  specLoaded: boolean;

  public options: any;

  private element: any;

  @Input() specUrl: string;

  // TODO: refactor in separate component/service
  showLoadingAnimation() {
    DOM.addClass(this.element, 'loading');
  }

  hideLoadingAnimation() {
    DOM.addClass(this.element, 'loading-remove');
    setTimeout(() => {
      DOM.removeClass(this.element, 'loading-remove');
      DOM.removeClass(this.element, 'loading');
    }, 400);
  }

  static displayError(err, elem?) {
    let redocEl = elem || DOM.query('redoc');
    if (!redocEl) return;
    let heading = 'Oops... ReDoc failed to render this spec';
    let details = err.message;
    let erroHtml = `<div class="redoc-error">
      <h1>${heading}</h1>
      <div class='redoc-error-details'>${details}</div>`;
    redocEl.innerHTML = erroHtml;
  }

  constructor(specMgr: SpecManager, optionsMgr:OptionsService, elementRef:ElementRef,
    public events:RedocEventsService, private changeDetector: ChangeDetectorRef) {
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

  load() {
    this.showLoadingAnimation();
    SpecManager.instance().load(this.options.specUrl).then(() => {
      this.specLoaded = true;
      this.changeDetector.markForCheck();
      //this.changeDetector.detectChanges();
      this.events.bootstrapped.next({});
      this.hideLoadingAnimation();
    }).catch((err) => {
      this.hideLoadingAnimation();
      Redoc.displayError(err, this.element);
      throw err;
    })
  }

  ngOnInit() {
    if (this.specUrl) {
      this.options.specUrl = this.specUrl;
    }
    this.load();
  }
}
