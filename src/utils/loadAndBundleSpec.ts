/* tslint:disable-next-line:no-implicit-dependencies */
import { convertObj } from 'swagger2openapi';
import { OpenAPISpec } from '../types';
import { Source, Document, bundle, loadConfig } from '@redocly/openapi-core';

export async function loadAndBundleSpec(specUrlOrObject: object | string): Promise<OpenAPISpec> {
  const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
  let bundleRef;
  const config = await loadConfig();
  if (typeof specUrlOrObject === 'object' && specUrlOrObject !== null) {
    bundleRef = {
      source: { absoluteRef: '' } as Source,
      parsed: specUrlOrObject
    } as Document
  } else {
    config.resolve.http.customFetch = fetch;
    bundleRef = specUrlOrObject;
  }

  const { bundle: { parsed } } = await bundle({
    ref: bundleRef,
    config,
    base: isNode ? process.cwd() : window.location.href
  });

  return parsed.swagger !== undefined ? convertSwagger2OpenAPI(parsed) : parsed;
}

export function convertSwagger2OpenAPI(spec: any): Promise<OpenAPISpec> {
  console.warn('[ReDoc Compatibility mode]: Converting OpenAPI 2.0 to OpenAPI 3.0');
  return new Promise<OpenAPISpec>((resolve, reject) =>
    convertObj(spec, { patch: true, warnOnly: true, text: '{}', anchors: true }, (err, res) => {
      // TODO: log any warnings
      if (err) {
        return reject(err);
      }
      resolve(res && (res.openapi as any));
    }),
  );
}
