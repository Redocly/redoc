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

/** The entry `buildServerEnvValues` gives the first server, as `[values, name]`; `undefined` without servers. */
export function firstServerEnv(
  servers: OpenAPIServer[] | undefined,
): [Record<string, string>, string] | undefined {
  const entry = servers?.length
    ? Object.entries(buildServerEnvValues(servers.slice(0, 1)))[0]
    : undefined;
  return entry && [entry[1], entry[0]];
}
