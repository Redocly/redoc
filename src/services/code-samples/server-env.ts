import type { OpenAPIServer } from '../../types/openapi.js';

import { normalizeServers } from './normalize-servers.js';
import { getServerEnvName } from '../../utils/environments.js';

/** Seeds one environment per global server so a saved environment name can resolve to a server in a fresh session. */
export function buildServerEnvValues(
  servers: OpenAPIServer[],
): Record<string, Record<string, string>> {
  const globalServers = normalizeServers(undefined, servers);
  return Object.fromEntries(
    globalServers.map((server) => [
      String(getServerEnvName(server)),
      {
        server: server.url,
        ...Object.fromEntries(
          Object.entries(server.variables ?? {}).map(([name, variable]) => [
            name,
            variable.default || '',
          ]),
        ),
      },
    ]),
  );
}
