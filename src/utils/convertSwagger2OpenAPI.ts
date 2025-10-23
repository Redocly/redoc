import swagger2openapi from 'swagger2openapi';

import type { OpenAPIDefinition } from '../types/index.js';

export function convertSwagger2OpenAPI(spec: GenericObject): Promise<OpenAPIDefinition> {
  if (!spec.paths) {
    spec.paths = {};
  }
  return new Promise<OpenAPIDefinition>((resolve, reject) =>
    swagger2openapi.convertObj(
      spec,
      { patch: true, warnOnly: true, text: '{}', anchors: true },
      (err, res) => {
        // TODO: log any warnings
        if (err) {
          return reject(err);
        }
        resolve(res?.openapi);
      },
    ),
  );
}
