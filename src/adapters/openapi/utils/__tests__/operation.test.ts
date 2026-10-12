import { describe, expect, it } from 'vitest';

import type { OpenAPIServer, OperationInfo } from '../../../../types/openapi.js';

import { getOperationData, pickOperationServers } from '../operation.js';

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
  } as OperationInfo;
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
