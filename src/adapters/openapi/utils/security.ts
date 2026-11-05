import type { OpenAPISecurityRequirement } from '../../../types/openapi.js';

import { isRecord } from '../../../utils/is-record.js';

/** The object entries of a `security` list; `undefined` when `security` is not an array. */
export function securityRequirements(security: unknown): OpenAPISecurityRequirement[] | undefined {
  return Array.isArray(security) ? security.filter(isSecurityRequirement) : undefined;
}

function isSecurityRequirement(value: unknown): value is OpenAPISecurityRequirement {
  return isRecord(value);
}
