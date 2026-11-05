import { describe, expect, it } from 'vitest';

import type { OpenAPIServer, OperationInfo } from '../../../../types/openapi.js';

import { getOperationData, pickOperationServers, serversWithUrl } from '../operation.js';

function makeOperation(overrides?: Partial<OperationInfo>): OperationInfo {
  return {
    pointer: '/paths/~1pets/get',
    pathName: '/pets',
    httpVerb: 'get',
    operationId: 'getPets',
    summary: 'List pets',
    tags: ['Pets'],
    isWebhook: false,
    isAdditionalOperation: false,
    ...overrides,
  };
}

describe('getOperationData', () => {

  it('derives the slug from the operationId when present', () => {
    const data = getOperationData(makeOperation({ operationId: 'getPets' }), '/docs/openapi');
    expect(data.slug).toBe('/docs/openapi/getpets');
  });

  it('derives the slug from the JSON pointer when the operation has no operationId (legacy behavior)', () => {
    const data = getOperationData(
      makeOperation({ operationId: undefined, pointer: '/paths/~1pets/get' }),
      '/docs/openapi',
    );
    // Pointer-derived, so the route stays the one existing links use (no redirect needed) —
    // not an httpVerb+pathName slug.
    expect(data.slug).toBe('/docs/openapi/paths/~1pets/get');
  });

  it('falls back to the verb+path slug when there is neither operationId nor pointer (no crash)', () => {
    const data = getOperationData(
      makeOperation({
        operationId: undefined,
        pointer: undefined as unknown as string,
        httpVerb: 'get',
        pathName: '/pets',
      }),
      '/docs/openapi',
    );
    expect(data.slug).toBe('/docs/openapi/get/pets');
  });
});

describe('pickOperationServers', () => {
  const productionServer: OpenAPIServer = { url: 'https://api.example.com' };
  const stagingServer: OpenAPIServer = { url: 'https://staging.example.com' };

  it('prefers operation servers when non-empty', () => {
    expect(pickOperationServers([productionServer], [stagingServer])).toEqual([productionServer]);
  });

  it('falls through to document servers when operation servers is an empty array (not `??`)', () => {
    expect(pickOperationServers([], [productionServer])).toEqual([productionServer]);
  });

  it('falls through to document servers when operation servers is undefined', () => {
    expect(pickOperationServers(undefined, [productionServer])).toEqual([productionServer]);
  });

  it('returns an empty array when neither list has servers', () => {
    expect(pickOperationServers([], undefined)).toEqual([]);
    expect(pickOperationServers(undefined, undefined)).toEqual([]);
  });
});

describe('servers without a url', () => {
  const validServer: OpenAPIServer = { url: 'https://api.example.com' };
  const invalidServers = [
    { description: 'Production' },
    { url: null },
    { url: 42 },
    null,
  ] as unknown as OpenAPIServer[];

  it('serversWithUrl keeps only servers whose url is a string', () => {
    expect(serversWithUrl([...invalidServers, validServer])).toEqual([validServer]);
  });

  it('serversWithUrl keeps an empty url, which is the relative URL of the description', () => {
    expect(serversWithUrl([{ url: '' }])).toEqual([{ url: '' }]);
  });

  it('serversWithUrl drops the variables that are not objects and keeps the server', () => {
    const port = { default: '443' };
    const servers = [
      { url: 'https://{host}:{port}', variables: { host: null, port } },
      { url: 'https://api.example.com', variables: 'none' },
      { url: 'https://{env}.example.com', variables: { env: null } },
    ] as unknown as OpenAPIServer[];

    expect(serversWithUrl(servers)).toEqual([
      { url: 'https://{host}:{port}', variables: { port } },
      { url: 'https://api.example.com', variables: undefined },
      { url: 'https://{env}.example.com', variables: undefined },
    ]);
  });

  it('serversWithUrl returns a server with valid variables as is', () => {
    const server: OpenAPIServer = {
      url: 'https://{host}',
      variables: { host: { default: 'api.example.com' } },
    };
    expect(serversWithUrl([server])[0]).toBe(server);
  });

  it('serversWithUrl returns no servers for a missing or non-array list', () => {
    expect(serversWithUrl(undefined)).toEqual([]);
    expect(
      serversWithUrl({ url: 'https://api.example.com' } as unknown as OpenAPIServer[]),
    ).toEqual([]);
  });

  it('pickOperationServers falls through when no operation server has a url', () => {
    expect(pickOperationServers(invalidServers, [validServer])).toEqual([validServer]);
  });

  it('pickOperationServers drops document servers without a url', () => {
    expect(pickOperationServers(undefined, [...invalidServers, validServer])).toEqual([
      validServer,
    ]);
    expect(pickOperationServers(undefined, invalidServers)).toEqual([]);
  });
});
