'use strict';

import {By} from 'angular2/platform/browser';

/** Gets a child DebugElement by tag name. */
export function getChildDebugElement(parent, tagName) {
  return parent.query(By.css(tagName));
}

/** Gets a child DebugElement by Component Type. */
export function getChildDebugElementByType(parent, type) {
  return parent.query(By.directive(type));
}

/** Gets a child DebugElements by tag name. */
export function getChildDebugElementAll(parent, tagName) {
  return parent.queryAll(By.css(tagName));
}

export function mouseclick( element ) {
    // create a mouse click event
    var event = document.createEvent( 'MouseEvents' );
    event.initMouseEvent( 'click', true, true, window, 1, 0, 0 );

    // send click to element
    element.dispatchEvent( event );
}
