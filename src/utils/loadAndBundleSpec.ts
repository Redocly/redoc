/* tslint:disable-next-line:no-implicit-dependencies */
import { convertObj } from 'swagger2openapi';
import { OpenAPISpec } from '../types';
import { Source, Document, bundle, Config, RawConfig } from '@redocly/openapi-core';
import { IS_BROWSER } from './dom';

export async function loadAndBundleSpec(specUrlOrObject: object | string): Promise<OpenAPISpec> {
  const rawConfig: RawConfig = {};
  const config = new Config(rawConfig);
  const bundleOpts = {
    config,
    base: IS_BROWSER ? window.location.href : process.cwd()
  }

  if (typeof specUrlOrObject === 'object' && specUrlOrObject !== null) {
    bundleOpts['doc'] = {
      source: { absoluteRef: '' } as Source,
      parsed: specUrlOrObject
    } as Document
  } else {
    config.resolve.http.customFetch = fetch;
    bundleOpts['ref'] = specUrlOrObject;
  }

  const { bundle: { parsed } } = await bundle(bundleOpts);
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
