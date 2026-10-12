import type { OpenAPIDefinition } from '../../types/openapi.js';

import { convertSwaggerToOpenApi } from './swagger.js';

export { convertSwaggerToOpenApi } from './swagger.js';
export { normalizeAsyncApiDefinition } from './asyncapi.js';

/** Promise form of `convertSwaggerToOpenApi`; rejects with the error it throws. */
export const convertSwagger2OpenAPI = async (
  document: Record<string, unknown>,
): Promise<OpenAPIDefinition> => convertSwaggerToOpenApi(document) as OpenAPIDefinition;
