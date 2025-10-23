import * as Sampler from 'openapi-sampler';

import type { JSONSchema7 } from 'json-schema';
export function safeSample(schema: JSONSchema7, options: Sampler.Options, document: object): any {
  try {
    return Sampler.sample(schema, options, document);
  } catch (e) {
    console.error(`Error sampling schema: ${e.message}`);

    return null;
  }
}
