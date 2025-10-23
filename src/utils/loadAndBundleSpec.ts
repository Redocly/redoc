import { bundleOas, createEmptyRedoclyConfig } from '@redocly/openapi-core/lib/bundle-oas';

import type { OpenAPIDefinition, ParsedDocument } from '../types/index.js';
import type { RedocConfig } from '@redocly/config';

import { convertSwagger2OpenAPI } from './convertSwagger2OpenAPI.js';
import { IS_BROWSER } from './dom.js';

export async function loadOpenapiConfig(): Promise<RedocConfig> {
  try {
    const config = await createEmptyRedoclyConfig();
    return (config?.resolvedConfig.openapi || {}) as RedocConfig;
  } catch {
    return {} as RedocConfig;
  }
}

export async function loadAndBundleDefinition(
  specUrlOrObject: Record<string, any> | string,
): Promise<OpenAPIDefinition> {
  const config = await createEmptyRedoclyConfig();

  const bundleOpts = {
    config,
    base: IS_BROWSER
      ? window.location.origin
      : typeof (globalThis as any).process !== 'undefined'
        ? (globalThis as any).process.cwd()
        : '',
  };

  if (IS_BROWSER) {
    config.resolve.http.customFetch = (globalThis as any).fetch;
  }

  if (typeof specUrlOrObject === 'object' && specUrlOrObject !== null) {
    bundleOpts['doc'] = createParsedDocument(specUrlOrObject);
  } else {
    bundleOpts['ref'] = specUrlOrObject;
  }

  const {
    bundle: { parsed },
  } = (await bundleOas(bundleOpts)) as { bundle: { parsed: ParsedDocument } };

  return parsed.swagger !== undefined ? convertSwagger2OpenAPI(parsed) : parsed;
}

function createParsedDocument(specUrlOrObject: Record<string, any> | string) {
  return {
    source: { absoluteRef: '' },
    parsed: specUrlOrObject,
  };
}
