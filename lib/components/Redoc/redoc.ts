'use strict';

import { ElementRef, ComponentRef, AfterViewInit, Component } from '@angular/core';

import { BrowserDomAdapter as DOM } from '../../utils/browser-adapter';
import { BaseComponent } from '../base';

import * as detectScollParent from 'scrollparent';

import { SpecManager } from '../../utils/SpecManager';
import { OptionsService, RedocEventsService } from '../../services/index';

@Component({
  selector: 'redoc',
  templateUrl: './redoc.html',
  styleUrls: ['./redoc.css'],
})
export class Redoc extends BaseComponent implements AfterViewInit {
  static appRef: ComponentRef<any>;

  options: any;

  private element: any;

  static showLoadingAnimation() {
    let elem = DOM.query('redoc');
    DOM.addClass(elem, 'loading');
  }

  static hideLoadingAnimation() {
    let redocEl = DOM.query('redoc');
    if (!redocEl) return;
    DOM.addClass(redocEl, 'loading-remove');
    setTimeout(() => {
      DOM.removeClass(redocEl, 'loading-remove');
      DOM.removeClass(redocEl, 'loading');
    }, 400);
  }

  static displayError(err) {
    let redocEl = DOM.query('redoc');
    if (!redocEl) return;
    let heading = 'Oops... ReDoc failed to render this spec';
    let details = err.message;
    let erroHtml = `<div class="redoc-error">
      <h1>${heading}</h1>
      <div class='redoc-error-details'>${details}</div>`;
    redocEl.innerHTML = erroHtml;
  }

  constructor(specMgr: SpecManager, optionsMgr:OptionsService, elementRef:ElementRef,
    public events:RedocEventsService) {
    super(specMgr);
    this.element = elementRef.nativeElement;
    //parse options (top level component doesn't support inputs)
    optionsMgr.parseOptions( this.element );
    let scrollParent = detectScollParent( this.element );
    if (scrollParent === DOM.defaultDoc().body) scrollParent = window;
    optionsMgr.options.$scrollParent = scrollParent;
    this.options = optionsMgr.options;
    this.events = events;
  }

  ngAfterViewInit() {
    setTimeout( () => {
      this.events.bootstrapped.next({});
    });
  }
}
