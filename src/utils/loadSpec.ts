import * as JsonSchemaRefParser from 'json-schema-ref-parser';

import { convertSwagger2OpenAPI } from './convertSpec';
import { OpenAPISpec } from '../types';

export async function loadSpec(specUrlOrObject: object | string): Promise<OpenAPISpec> {
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
