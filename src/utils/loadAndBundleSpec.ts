import * as JsonSchemaRefParser from 'json-schema-ref-parser';
import { convertObj } from 'swagger2openapi';
import { OpenAPISpec } from '../types';

export async function loadAndBundleSpec(specUrlOrObject: object | string): Promise<OpenAPISpec> {
  const _parser = new JsonSchemaRefParser();
  const spec = await _parser.bundle(specUrlOrObject, {
    resolve: { http: { withCredentials: false } },
  } as object);

  if (spec.swagger !== undefined) {
    return convertSwagger2OpenAPI(spec);
  } else {
    return spec;
  }
}

export function convertSwagger2OpenAPI(spec: any): Promise<OpenAPISpec> {
  console.warn('[ReDoc Compatibility mode]: Converting OpenAPI 2.0 to OpenAPI 3.0');
  return new Promise<OpenAPISpec>((resolve, reject) =>
    convertObj(spec, {}, (err, res) => {
      // TODO: log any warnings
      if (err) {
        return reject(err);
      }
      resolve(res && (res.openapi as any));
    }),
  );
}
