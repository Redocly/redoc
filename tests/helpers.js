'use strict';

import {BrowserDomAdapter} from 'angular2/platform/browser';
BrowserDomAdapter.makeCurrent();

/** Gets a child DebugElement by tag name. */
export function getChildDebugElement(parent, tagName) {
  return parent.query(debugEl => {
    return debugEl.nativeElement.tagName && debugEl.nativeElement.tagName.toLowerCase() === tagName;
  });
}

/** Gets a child DebugElements by tag name. */
export function getChildDebugElementAll(parent, tagName) {
  return parent.queryAll(debugEl => {
    return debugEl.nativeElement.tagName && debugEl.nativeElement.tagName.toLowerCase() === tagName;
  });
}

export function mouseclick( element ) {
    // create a mouse click event
    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0 );

    // send click to element
    element.dispatchEvent( event );
}
