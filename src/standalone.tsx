import { createElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import type { ErrorInfo } from 'react';
import type { RedocConfig } from '@redocly/config';
import type { OpenAPIDefinition } from './types/open-api.js';
import type { StoreProviderProps } from './components/RedoclyOpenAPIDocs/types.js';

type GenericObject = Record<string, any>;

import { querySelector } from './utils/dom.js';
import { RedoclyOpenAPIDocs } from './components/RedoclyOpenAPIDocs/RedoclyOpenAPIDocs.js';
import { RedoclyOpenAPIDocsStandalone } from './components/RedoclyOpenAPIDocs/RedoclyOpenAPIDocsStandalone.js';

export { setSecurityDetails, setSecurityDetailsVariants } from './utils/security-details.js';
export { setParameterValue } from './utils/parameters.js';

function attributesMap(element: Element) {
  const res = {};
  const elAttrs = element.attributes;
  // tslint:disable-next-line
  for (let i = 0; i < elAttrs.length; i++) {
    const attrib = elAttrs[i];
    res[attrib.name] = attrib.value;
  }
  return res;
}

function parseOptionsFromElement(element: Element) {
  const attrMap = attributesMap(element);
  const res = {};
  for (const attrName in attrMap) {
    const optionName = attrName.replace(/-(.)/g, (_, $1) => $1.toUpperCase());
    res[optionName] = attrMap[attrName];
    // TODO: normalize options
  }
  return res;
}

export function hydrate(
  store: StoreProviderProps,
  element: Element | null = document.querySelector('redoc'),
): void {
  hydrateRoot(element as Element, <RedoclyOpenAPIDocs store={store} typeOfUsage="cli" />, {
    onRecoverableError: (error: Error, errorInfo: ErrorInfo) => {
      if (error.message.includes('Minified React error #418')) {
        // we use memory router for ssr and hash router for client
        return;
      }
      console.error(error.message, errorInfo);
    },
  });
}

export function init(
  definitionOrDefinitionUrl: string | OpenAPIDefinition,
  options: RedocConfig & { router?: 'hash' | 'history'; disableTelemetry?: boolean } = {},
  element: Element | null = querySelector('redoc'),
): void {
  if (element === null) {
    throw new Error('"element" argument is not provided and <redoc> tag is not found on the page');
  }
  const {
    router,
    disableTelemetry = false,
    typeOfUsage = 'html',
    ...restOptions
  } = {
    ...options,
    ...parseOptionsFromElement(element),
  };

  let definitionUrl: string | undefined;
  let definition: GenericObject | undefined;

  if (typeof definitionOrDefinitionUrl === 'string') {
    definitionUrl = definitionOrDefinitionUrl;
  } else if (typeof definitionOrDefinitionUrl === 'object') {
    definition = definitionOrDefinitionUrl;
  }

  const root = createRoot(element);

  root.render(
    createElement(
      RedoclyOpenAPIDocsStandalone,
      {
        definition,
        definitionUrl,
        disableTelemetry,
        options: restOptions,
        router: router ?? 'hash',
        typeOfUsage: typeOfUsage ?? 'html',
      },
      ['Loading...'],
    ),
  );
}

/**
 * autoinit ReDoc if <redoc> tag is found on the page with "spec-url" attr
 */
function autoInit() {
  const element = querySelector('redoc');
  if (!element) {
    return;
  }
  const specUrl = element.getAttribute('spec-url');
  if (specUrl) {
    init(specUrl, {}, element);
  }
}

autoInit();
