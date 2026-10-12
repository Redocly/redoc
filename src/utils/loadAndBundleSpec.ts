import { createEmptyRedoclyConfig } from '@redocly/openapi-core/lib/bundle-oas';
import { bundle, type Document } from '@redocly/openapi-core';

import type { RedocConfig } from '@redocly/config';
import type { OpenAPIDefinition, ParsedDocument } from '../types/openapi.js';

import { IS_BROWSER } from '@redocly/theme/core/openapi';

import { convertSwaggerToOpenApi } from '../services/spec-convert/index.js';
import { DefinitionLoadError, errorMessage } from './definitionLoadError.js';

export async function loadOpenapiConfig(): Promise<RedocConfig> {
  try {
    const config = createEmptyRedoclyConfig();
    return (config?.resolvedConfig.openapi || {}) as RedocConfig;
  } catch {
    return {} as RedocConfig;
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

  if (typeof specUrlOrObject === 'object' && specUrlOrObject !== null) {
    bundleOpts.doc = createParsedDocument(specUrlOrObject) as unknown as Document;
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
    throw new DefinitionLoadError(stage, message, lastStatus);
  }

  if (parsed.swagger !== undefined) return convertSwaggerToOpenApi(parsed) as OpenAPIDefinition;
  return parsed;
}

function createParsedDocument(specUrlOrObject: Record<string, unknown> | string) {
  return {
    source: { absoluteRef: '' },
    parsed: specUrlOrObject,
  };
}
