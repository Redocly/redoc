import { isRecord } from '../../adapters/helpers.js';

import type { ApiStore } from '../../types/store.js';

/** Credentials the docs store to pre-fill Try It. The request console reads them; an agent never does. */
function isCredentialKey(key: string): boolean {
  return key === 'serverValues' || key.startsWith('x-default');
}

type ApiSecuritySummary = {
  servers: Array<{ url: string; description?: string }>;
  securitySchemes: Array<Record<string, unknown> & { id: string }>;
};

/** Servers and security schemes of the documented API, with every stored credential removed. */
export function summarizeSecurity(store: ApiStore): ApiSecuritySummary {
  return {
    servers: (store.servers ?? []).map((server) => ({
      url: server.url,
      ...(server.description ? { description: server.description } : {}),
    })),
    securitySchemes: Object.entries(store.securitySchemeStore ?? {}).map(([id, scheme]) => ({
      id,
      ...(isRecord(scheme)
        ? Object.fromEntries(Object.entries(scheme).filter(([key]) => !isCredentialKey(key)))
        : {}),
    })),
  };
}
