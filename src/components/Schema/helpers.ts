import type { SchemaProps } from './types.js';

import { isUndefined } from '@redocly/theme/core/openapi';

export const extractTypeFromDeepLink = (str?: string): string => {
  if (!str) return '';

  const match = str.match(/t=(request|response)/);
  return match ? match[1] : '';
};

const DEFAULT_REQUIRE_EXPAND_LEVEL = 4;

export function getExpandByDefault({
  schemasExpansionLevel,
  level,
  required,
}: Pick<SchemaProps, 'level' | 'required'> & { schemasExpansionLevel?: number }) {
  const normalizedLevel = Number(level) - 1;

  if (!isUndefined(schemasExpansionLevel)) {
    return schemasExpansionLevel >= normalizedLevel;
  }

  return Boolean(required) && DEFAULT_REQUIRE_EXPAND_LEVEL >= normalizedLevel;
}
