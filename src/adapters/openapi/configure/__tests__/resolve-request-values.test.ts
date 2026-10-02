import { describe, it, expect, vi, beforeEach } from 'vitest';

import { resolveRequestValues } from '../resolve-request-values.js';
import type { OperationInfo } from '../../../../types/openapi.js';

vi.mock('@redocly/theme/ext/configure', () => ({
  configure: vi.fn(),
}));

const { configure } = await import('@redocly/theme/ext/configure');

const baseOperationInfo: OperationInfo = {
  pointer: '/paths/~1pets/get',
  pathName: '/pets',
  httpVerb: 'get',
  operationId: 'getPets',
  summary: 'List pets',
  isWebhook: false,
  isAdditionalOperation: false,
  tags: ['Pets'],
};

describe('resolveRequestValues', () => {
  beforeEach(() => {
    vi.mocked(configure).mockReturnValue({});
  });

  it('returns dynamicRequestValues when provided', () => {
    const dynamic = {
      headers: { 'X-Custom': 'value' },
      query: { limit: '10' },
    };
    const result = resolveRequestValues({
      operationInfo: baseOperationInfo,
      info: {},
      servers: [{ url: 'https://api.example.com' }],
      basePath: '/api',
      dynamicRequestValues: dynamic,
    });
    expect(result).toBe(dynamic);
    expect(configure).not.toHaveBeenCalled();
  });

  it('calls configure and returns requestValues when no dynamicRequestValues', () => {
    const configValues = {
      headers: { Authorization: 'Bearer token' },
    };
    vi.mocked(configure).mockReturnValue({ requestValues: configValues });

    const result = resolveRequestValues({
      operationInfo: baseOperationInfo,
      info: { title: 'API', version: '1.0' },
      servers: [{ url: 'https://api.example.com' }],
      basePath: '/api',
    });

    expect(configure).toHaveBeenCalledWith(
      expect.objectContaining({
        info: { title: 'API', version: '1.0' },
        operation: expect.objectContaining({
          name: 'List pets',
          path: '/pets',
          operationId: 'getPets',
          method: 'get',
        }),
        servers: [{ url: 'https://api.example.com' }],
      }),
    );
    expect(result).toEqual(configValues);
  });

  it('returns empty object when configure returns no requestValues', () => {
    const result = resolveRequestValues({
      operationInfo: baseOperationInfo,
      info: {},
      servers: [],
      basePath: '/api',
    });
    expect(result).toEqual({});
  });

  it('dynamicRequestValues overrides configure result when both would apply', () => {
    vi.mocked(configure).mockClear();
    const dynamic = { query: { limit: '10' } };

    const result = resolveRequestValues({
      operationInfo: baseOperationInfo,
      info: {},
      servers: [{ url: 'https://api.example.com' }],
      basePath: '/api',
      dynamicRequestValues: dynamic,
    });

    expect(result).toBe(dynamic);
    expect(result).toEqual({ query: { limit: '10' } });
    expect(configure).not.toHaveBeenCalled();
  });
});
