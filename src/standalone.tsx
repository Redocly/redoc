import './crypto-uuid-compat.js';

import { createElement } from 'react';
import { createRoot, hydrateRoot, type Root } from 'react-dom/client';
import { HashRouter } from 'react-router';

import type { ReactElement } from 'react';
import type { RedocStandaloneProps } from './RedocStandalone.js';
import type { TypeOfUsage } from './telemetry/RedocTelemetry.js';

import { RedocStandalone, isTelemetryDisabled, prepareApiDocs } from './RedocStandalone.js';
import { TypeOfUsageContext } from './telemetry/TypeOfUsageContext.js';
import { RedoclyApiDocsStandalone } from './RedoclyApiDocsStandalone.js';
import { logoFromSpec } from './utils/x-logo.js';
import { decodeDeepLinkSeparator } from './hooks/deepLinkHash.js';

export { RedocStandalone };
export type { RedocStandaloneProps };

export type InitOptions = NonNullable<RedocStandaloneProps['options']> & {
  router?: 'hash' | 'history';
  disableTelemetry?: boolean;
  /** The Docker image sets `type-of-usage="docker"` on the `<redoc>` element. */
  typeOfUsage?: TypeOfUsage;
  basePath?: string;
};

const TYPES_OF_USAGE: readonly TypeOfUsage[] = ['html', 'cli', 'react', 'docker'];

function resolveTypeOfUsage(value: unknown, fallback: TypeOfUsage): TypeOfUsage {
  return TYPES_OF_USAGE.includes(value as TypeOfUsage) ? (value as TypeOfUsage) : fallback;
}

function querySelector(selector: string): Element | null {
  return typeof document !== 'undefined' ? document.querySelector(selector) : null;
}

function attributesMap(element: Element): Record<string, string> {
  const res: Record<string, string> = {};
  for (const attrib of Array.from(element.attributes)) {
    res[attrib.name] = attrib.value;
  }
  return res;
}

function parseOptionsFromElement(element: Element): Record<string, string> {
  const attrMap = attributesMap(element);
  const res: Record<string, string> = {};
  for (const attrName in attrMap) {
    const optionName = attrName.replace(/-(.)/g, (_, $1: string) => $1.toUpperCase());
    res[optionName] = attrMap[attrName];
  }
  return res;
}

type ResolvedArgs = {
  router?: 'hash' | 'history';
  typeOfUsage: TypeOfUsage;
  props: RedocStandaloneProps;
};

function resolveArgs(
  specOrSpecUrl: string | Record<string, unknown>,
  options: InitOptions,
  element: Element,
  defaultTypeOfUsage: TypeOfUsage,
): ResolvedArgs {
  const { router, typeOfUsage, basePath, ...restOptions }: InitOptions & Record<string, unknown> = {
    ...options,
    ...parseOptionsFromElement(element),
  };

  let specUrl: string | undefined;
  let spec: Record<string, unknown> | string | undefined;

  if (typeof specOrSpecUrl === 'string') {
    // A raw GraphQL SDL or JSON string is a spec, not a URL.
    if (!isUrlLike(specOrSpecUrl) || /^\s*[[{]/.test(specOrSpecUrl)) {
      spec = specOrSpecUrl;
    } else {
      specUrl = specOrSpecUrl;
    }
  } else if (typeof specOrSpecUrl === 'object') {
    spec = specOrSpecUrl;
  }

  return {
    router,
    typeOfUsage: resolveTypeOfUsage(typeOfUsage, defaultTypeOfUsage),
    props: {
      spec,
      specUrl,
      options: restOptions,
      basePath,
    },
  };
}

function restoreDeepLinkSeparator(): void {
  const canonical = decodeDeepLinkSeparator(window.location.hash);
  if (canonical !== window.location.hash) window.location.replace(canonical);
}

function wrapInRouter(app: ReactElement, router: 'hash' | 'history' | undefined): ReactElement {
  // hash routing works from file:// and any static host, so it's the default
  if (router === 'history') return app;
  restoreDeepLinkSeparator();
  window.addEventListener('hashchange', restoreDeepLinkSeparator);
  return createElement(HashRouter, null, app);
}

function requireElement(element: Element | null): Element {
  if (element === null) {
    throw new Error('"element" argument is not provided and <redoc> tag is not found on the page');
  }
  return element;
}

export function init(
  specOrSpecUrl: string | Record<string, unknown>,
  options: InitOptions = {},
  element: Element | null = querySelector('redoc'),
): Root {
  const target = requireElement(element);
  const { router, typeOfUsage, props } = resolveArgs(specOrSpecUrl, options, target, 'html');

  const app = createElement(
    TypeOfUsageContext.Provider,
    { value: typeOfUsage },
    createElement(RedocStandalone, props),
  );
  const root = createRoot(target);
  root.render(wrapInRouter(app, router));
  return root;
}

// #418/#423: memory-router (server) vs hash-router (client) hrefs differ
const HYDRATION_MISMATCH =
  /server rendered HTML didn't match the client|error while hydrating|Minified React error #(418|423)/;

/**
 * Attaches to server-rendered markup instead of replacing it. The spec must be
 * the same pre-bundled document the server pass rendered from.
 */
export async function hydrate(
  specOrSpecUrl: string | Record<string, unknown>,
  options: InitOptions = {},
  element: Element | null = querySelector('redoc'),
): Promise<void> {
  const target = requireElement(element);
  const { router, typeOfUsage, props } = resolveArgs(specOrSpecUrl, options, target, 'cli');
  const basePath = props.basePath ?? '/';

  // hydration must render the post-resolution tree, as the server pass does
  const prepared = await prepareApiDocs({ ...props, basePath });

  const app: ReactElement = createElement(RedoclyApiDocsStandalone, {
    items: prepared.items,
    store: prepared.store,
    basePath,
    options: prepared.options,
    logo: logoFromSpec(prepared.document),
    telemetryConfig: {
      typeOfUsage,
      ...(isTelemetryDisabled(props.options?.disableTelemetry) ? { disabled: true } : {}),
    },
    spec: prepared.document,
    specUrl: props.specUrl,
  });

  if (target.childElementCount === 0) {
    createRoot(target).render(wrapInRouter(app, router));
    return;
  }

  hydrateRoot(target, wrapInRouter(app, router), {
    onRecoverableError: (error, errorInfo) => {
      const message = error instanceof Error ? error.message : String(error);
      if (HYDRATION_MISMATCH.test(message)) {
        return;
      }
      console.error(message, errorInfo);
    },
  });
}

function isUrlLike(value: string): boolean {
  return !value.includes('\n') && /^[^\s]+$/.test(value);
}

/** Auto-initializes when a `<redoc spec-url="...">` tag is present on the page. */
function autoInit(): void {
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
