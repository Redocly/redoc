import { render } from 'react-dom';
import * as React from 'react';

import { RedocStandalone } from './components/RedocStandalone';

export const version = __REDOC_VERSION__;
export const revision = __REDOC_REVISION__;

function attributesMap(element: Element) {
  var res = {};
  var elAttrs = element.attributes;
  for (let i = 0; i < elAttrs.length; i++) {
    var attrib = elAttrs[i];
    res[attrib.name] = attrib.value;
  }
  return res;
}

function parseOptionsFromElement(element: Element) {
  const attrMap = attributesMap(element);
  const res = {};
  for (let attrName in attrMap) {
    const optionName = attrName.replace(/-(.)/g, (_, $1) => $1.toUpperCase());
    res[optionName] = attrMap[attrName];
    // TODO: normalize options
  }
  return res;
}

export function init(
  specOrSpecUrl: string | any,
  options: any = {},
  element: Element | null = document.querySelector('redoc'),
) {
  if (element === null) {
    throw new Error('"element" argument is not provided and <redoc> tag is not found on the page');
  }

  let specUrl: string | undefined;
  let spec: object | undefined;

  if (typeof specOrSpecUrl === 'string') {
    specUrl = specOrSpecUrl;
  } else if (typeof specOrSpecUrl === 'object') {
    spec = specOrSpecUrl;
  }

  render(
    React.createElement(
      RedocStandalone,
      {
        spec,
        specUrl,
        options: { ...options, ...parseOptionsFromElement(element) },
      },
      ['Loading...'],
    ),
    element,
  );
}

/**
 * autoinit ReDoc if <redoc> tag is found on the page with "spec-url" attr
 */
function autoInit() {
  const element = document.querySelector('redoc');
  if (!element) {
    return;
  }
  const specUrl = element.getAttribute('spec-url');
  if (specUrl) {
    init(specUrl, {}, element);
  }
}

autoInit();
