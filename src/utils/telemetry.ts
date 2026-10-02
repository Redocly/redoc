import { withPathPrefix } from '@redocly/theme/core/openapi';

import { IS_BROWSER } from './environments.js';

export function getDefaultCollectorUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4318';
  }
  return IS_BROWSER ? window.location.origin + withPathPrefix('/_otel') : '';
}
