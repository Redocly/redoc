import type { AsyncApiServer } from '../../../types/asyncapi.js';

/** AsyncAPI 3.x uses `host`; 2.x documents provide `url` instead. */
export function getServerHost(server: AsyncApiServer): string | undefined {
  return server.host ?? server.url;
}
