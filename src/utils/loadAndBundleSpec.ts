import { createEmptyRedoclyConfig } from '@redocly/openapi-core/lib/bundle-oas';
import { BaseResolver, bundle, detectSpec, type Document } from '@redocly/openapi-core';

import type { RedocConfig } from '@redocly/config';
import type { OpenAPIDefinition, ParsedDocument } from '../types/openapi.js';

import { IS_BROWSER } from '@redocly/theme/core/openapi';

import { DefinitionLoadError, errorMessage } from './definitionLoadError.js';
import { reportError } from '../telemetry/reportError.js';

export async function loadOpenapiConfig(): Promise<RedocConfig> {
  try {
    const config = createEmptyRedoclyConfig();
    return (config?.resolvedConfig.openapi || {}) as RedocConfig;
  } catch {
    return {};
  }
}

export async function loadAndBundleDefinition(
  specUrlOrObject: Record<string, unknown> | string,
): Promise<OpenAPIDefinition> {
  const config = createEmptyRedoclyConfig();

  const bundleOpts: Parameters<typeof bundle>[0] = {
    config,
    base: IS_BROWSER
      ? document.baseURI || window.location.href
      : typeof (globalThis as unknown as { process: { cwd: () => string } }).process !== 'undefined'
        ? (globalThis as unknown as { process: { cwd: () => string } }).process.cwd()
        : '',
  };

  let lastStatus: number | undefined;
  if (IS_BROWSER) {
    const browserFetch = (globalThis as unknown as { fetch: typeof fetch }).fetch;
    const trackedFetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
      const response = await browserFetch(...args);
      lastStatus = response.status;
      return response;
    };
    config.resolve.http.customFetch = trackedFetch as typeof config.resolve.http.customFetch;
  }

  // Shared with the bundle, so the fallback below reads the already-fetched root document.
  const externalRefResolver = new BaseResolver(config.resolve);
  bundleOpts.externalRefResolver = externalRefResolver;

  if (typeof specUrlOrObject === 'object' && specUrlOrObject !== null) {
    // Relative $refs in an inline spec resolve against the page; with an empty ref openapi-core
    // falls back to `process.cwd()`, which does not exist in the browser.
    const absoluteRef = (IS_BROWSER && bundleOpts.base) || '';
    bundleOpts.doc = createParsedDocument(specUrlOrObject, absoluteRef) as unknown as Document;
  } else {
    bundleOpts.ref = specUrlOrObject;
  }

  let parsed: ParsedDocument;
  try {
    ({
      bundle: { parsed },
    } = (await bundle(bundleOpts)) as { bundle: { parsed: ParsedDocument } });
  } catch (error) {
    const message = errorMessage(error);
    const stage =
      lastStatus !== undefined && lastStatus >= 400
        ? 'fetch'
        : /yaml|json|parse|unexpected token/i.test(message)
          ? 'parse'
          : 'bundle';
    const unbundled =
      stage === 'bundle' ? await readUnbundled(bundleOpts, externalRefResolver) : undefined;
    if (unbundled === undefined) throw new DefinitionLoadError(stage, message, lastStatus);
    reportError(
      'bundleDocument',
      error,
      'Could not bundle the API description; rendering it as is',
    );
    return unbundled;
  }

  return parsed;
}

// The root document as parsed, when it parsed into a supported description: external `$ref`s
// stay unresolved.
async function readUnbundled(
  opts: Parameters<typeof bundle>[0],
  resolver: BaseResolver,
): Promise<ParsedDocument | undefined> {
  const document =
    opts.doc ??
    (opts.ref === undefined
      ? undefined
      : await resolver.resolveDocument(opts.base ?? null, opts.ref, true));
  if (document === undefined || document instanceof Error) return undefined;
  try {
    detectSpec(document.parsed);
  } catch {
    return undefined;
  }
  return document.parsed as ParsedDocument;
}

function createParsedDocument(specUrlOrObject: Record<string, unknown>, absoluteRef: string) {
  return {
    source: { absoluteRef },
    parsed: specUrlOrObject,
  };
}
