import { describe, expect, it } from 'vitest';

import type { OperationInfo } from '../../../../types/openapi.js';

import { getOperationData } from '../operation.js';

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

  it('falls back both title and description to the summary when there is no operation description', () => {
    const data = getOperationData(makeOperation({ summary: 'List pets' }), '/docs/openapi');
    expect(data.seo).toEqual({ title: 'List pets', description: 'List pets' });
  });

  it('prefers the operation description over the summary when both are present', () => {
    const data = getOperationData(
      makeOperation({ summary: 'List pets', description: 'Returns all pets in the store.' }),
      '/docs/openapi',
    );
    expect(data.seo).toEqual({
      title: 'List pets',
      description: 'Returns all pets in the store.',
    });
  });

  it('derives the slug from the operationId when present', () => {
    const data = getOperationData(makeOperation({ operationId: 'getPets' }), '/docs/openapi');
    expect(data.slug).toBe('/docs/openapi/getpets');
  });

  it('derives the slug from the JSON pointer when the operation has no operationId (legacy parity)', () => {
    const data = getOperationData(
      makeOperation({ operationId: undefined, pointer: '/paths/~1pets/get' }),
      '/docs/openapi',
    );
    // Matches legacy openapi-docs `getOperationId` → `pointerToId(pointer)`, so the route is
    // identical to the legacy one (no redirect needed). NOT the new httpVerb+pathName scheme.
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
