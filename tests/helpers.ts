'use strict';

import {By} from '@angular/platform-browser';
import {getDOM} from '@angular/platform-browser/src/dom/dom_adapter';

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
    var dispatchedEvent = getDOM().createMouseEvent('click');
    // send click to element
    getDOM().dispatchEvent(element, dispatchedEvent);
}
