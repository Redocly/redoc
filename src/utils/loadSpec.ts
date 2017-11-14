import { OpenAPISpec } from '../types';

import * as JsonSchemaRefParser from 'json-schema-ref-parser';

export async function loadSpec(specUrlOrObject: object | string): Promise<OpenAPISpec> {
  const _parser = new JsonSchemaRefParser();
  return await _parser.bundle(specUrlOrObject, {
    resolve: { http: { withCredentials: false } },
  } as object);
}
