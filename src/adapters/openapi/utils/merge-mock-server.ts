
/** Operation servers win when non-empty; an empty array falls through to the
 *  document servers (see the empty-array test — a `??` fallback would not). */
export function pickOperationServers<T>(
  operationServers: T[] | undefined,
  documentServers: T[] | undefined,
): T[] {
  return operationServers && operationServers.length > 0
    ? operationServers
    : (documentServers ?? []);
}

/** Strips servers flagged as mock servers. Returns the same reference when
 *  nothing is flagged. */
export function excludeMockServers<T extends { isMockServer?: boolean }>(servers: T[]): T[] {
  return servers.some((server) => server.isMockServer)
    ? servers.filter((server) => !server.isMockServer)
    : servers;
}
