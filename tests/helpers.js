'use strict';

import {BrowserDomAdapter} from 'angular2/platform/browser';
BrowserDomAdapter.makeCurrent();

/** Gets a child DebugElement by tag name. */
export function getChildDebugElement(parent, tagName) {
  return parent.query(debugEl => {
    return debugEl.nativeElement.tagName && debugEl.nativeElement.tagName.toLowerCase() === tagName;
  });
}
