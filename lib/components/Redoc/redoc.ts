'use strict';

import { ElementRef, ComponentRef, AfterViewInit, Component } from '@angular/core';

import { BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { BaseComponent } from '../base';

import detectScollParent from 'scrollparent';

import { SpecManager } from '../../utils/SpecManager';
import { OptionsService, RedocEventsService } from '../../services/index';

var dom = new BrowserDomAdapter();

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
    let elem = dom.query('redoc');
    dom.addClass(elem, 'loading');
  }

  static hideLoadingAnimation() {
    let redocEl = dom.query('redoc');
    if (!redocEl) return;
    dom.addClass(redocEl, 'loading-remove');
    setTimeout(() => {
      dom.removeClass(redocEl, 'loading-remove');
      dom.removeClass(redocEl, 'loading');
    }, 400);
  }

  static displayError(err) {
    let redocEl = dom.query('redoc');
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
    optionsMgr.options.$scrollParent = detectScollParent( this.element );
    this.options = optionsMgr.options;
    this.events = events;
  }

  ngAfterViewInit() {
    setTimeout( () => {
      this.events.bootstrapped.next({});
    });
  }
}
