import swagger2openapi from 'swagger2openapi';

import type { OpenAPIDefinition } from '../../types/openapi.js';

export function convertSwagger2OpenAPI(spec: GenericObject): Promise<OpenAPIDefinition> {
  if (!spec.paths) {
    spec.paths = {};
  }
  return new Promise<OpenAPIDefinition>((resolve, reject) =>
    swagger2openapi.convertObj(
      spec as unknown as Parameters<typeof swagger2openapi.convertObj>[0],
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res?.openapi as OpenAPIDefinition);
      },
    ),
  );
}
