import * as JsonSchemaRefParser from 'json-schema-ref-parser';
/* tslint:disable-next-line:no-implicit-dependencies */
import { convertObj } from 'swagger2openapi';
import { OpenAPISpec } from '../types';

export async function loadAndBundleSpec(specUrlOrObject: object | string): Promise<OpenAPISpec> {
  const parser = new JsonSchemaRefParser();
  const spec = (await parser.bundle(specUrlOrObject, {
    resolve: { http: { withCredentials: false } },
  } as object)) as any;

  if (spec.swagger !== undefined) {
    return convertSwagger2OpenAPI(spec);
  } else {
    return spec;
  }
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
