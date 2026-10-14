import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DefinitionLoadError } from '../definitionLoadError.js';

const loadAndBundleDefinition = vi.fn();

vi.mock('../loadAndBundleSpec.js', () => ({ loadAndBundleDefinition }));

const { convertedDownloadUrl, convertedFileName, resolveSpec } = await import('../resolveSpec.js');

const SDL = 'type Query { beans: [String] }';
const openapi = { openapi: '3.1.0', info: { title: 'Cafe', version: '1.0.0' }, paths: {} };
const asyncapi2 = {
  asyncapi: '2.6.0',
  info: { title: 'Cafe events', version: '1.0.0' },
  channels: {
    'orders/placed': { subscribe: { operationId: 'orderPlaced', message: { name: 'Order' } } },
  },
};

function mockFetch(response: Partial<Response> | Error): void {
  vi.stubGlobal(
    'fetch',
    response instanceof Error
      ? vi.fn().mockRejectedValue(response)
      : vi.fn().mockResolvedValue(response),
  );
}

function readText(blob: Blob | undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    if (blob) reader.readAsText(blob);
  });
}

async function rejection(promise: Promise<unknown>): Promise<DefinitionLoadError> {
  const error = await promise.then(
    () => undefined,
    (reason: unknown) => reason,
  );
  expect(error).toBeInstanceOf(DefinitionLoadError);
  return error as DefinitionLoadError;
}

describe('resolveSpec', () => {
  beforeEach(() => {
    loadAndBundleDefinition.mockReset();
    loadAndBundleDefinition.mockImplementation((source: unknown) => Promise.resolve(source));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('spec strings', () => {
    it('parses YAML text with an openapi, swagger or asyncapi key', async () => {
      const swagger = await resolveSpec({
        spec: 'swagger: "2.0"\ninfo:\n  title: Cafe\n  version: 1.0.0\npaths: {}\n',
        skipBundle: false,
      });
      const events = await resolveSpec({
        spec: 'asyncapi: 3.0.0\ninfo:\n  title: Cafe events\n  version: 1.0.0\n',
        skipBundle: false,
      });

      expect(swagger.type).toBe('openapi');
      expect(swagger.convertedFrom).toBe('2.0');
      expect((swagger.document as Record<string, unknown>).openapi).toBe('3.2.0');
      expect(events.type).toBe('asyncapi');
      expect(events.convertedFrom).toBeUndefined();
      expect(loadAndBundleDefinition).toHaveBeenCalledTimes(2);
    });

    it('keeps the SDL next to the parsed GraphQL document', async () => {
      const resolved = await resolveSpec({ spec: SDL, skipBundle: false });

      expect(resolved).toMatchObject({ type: 'graphql', sdl: SDL });
      expect(resolved.document).toMatchObject({ kind: 'Document' });
    });

    it('reads SDL with a long CRLF comment header in linear time', async () => {
      const spec = '#\r\n'.repeat(40) + SDL;
      const resolved = await resolveSpec({ spec, skipBundle: false });

      expect(resolved).toMatchObject({ type: 'graphql', sdl: spec });
    });

    it('reads YAML without an API key as GraphQL and reports its syntax error', async () => {
      const error = await rejection(resolveSpec({ spec: 'title: Cafe', skipBundle: false }));

      expect(error.stage).toBe('parse');
    });

    it('reports invalid JSON as a parse error', async () => {
      const error = await rejection(resolveSpec({ spec: '{"openapi": ', skipBundle: false }));

      expect(error.stage).toBe('parse');
    });
  });

  describe('JSON and YAML text', () => {
    it('keeps unquoted YAML dates as strings', async () => {
      const resolved = await resolveSpec({
        spec: 'openapi: 3.1.0\ninfo:\n  title: T\n  version: 2024-01-01\npaths: {}\n',
        skipBundle: true,
      });

      expect(resolved.document).toMatchObject({ info: { version: '2024-01-01' } });
    });

    it.each([
      ['a bad indent', 'openapi: 3.1.0\ninfo:\n  title: T\n version: 1\n'],
      ['several documents', '---\nopenapi: 3.1.0\n---\nopenapi: 3.1.0\n'],
      ['a leading comment', '# Cafe\nopenapi: 3.1.0\ninfo:\n  title: T\n version: 1\n'],
    ])('reports the YAML error for OpenAPI text with %s', async (_, spec) => {
      const error = await rejection(resolveSpec({ spec, skipBundle: true }));

      expect(error.stage).toBe('parse');
      expect(error.message).not.toMatch(/^Syntax Error/);
    });

    it('reads JSON that starts with a byte order mark', async () => {
      const resolved = await resolveSpec({
        spec: `\uFEFF${JSON.stringify(openapi)}`,
        skipBundle: true,
      });

      expect(resolved.document).toEqual(openapi);
    });

    it('reads flow-style YAML that starts with a brace', async () => {
      const resolved = await resolveSpec({
        spec: "{openapi: 3.1.0, info: {title: T, version: '1'}, paths: {}}",
        skipBundle: true,
      });

      expect(resolved.document).toMatchObject({ openapi: '3.1.0', info: { title: 'T' } });
    });
  });

  it('converts a spec object that structuredClone cannot copy', async () => {
    const spec = JSON.parse(JSON.stringify(asyncapi2));
    vi.stubGlobal('structuredClone', () => {
      throw new DOMException('could not be cloned', 'DataCloneError');
    });

    const resolved = await resolveSpec({ spec, skipBundle: true });

    expect(resolved.convertedFrom).toBe('2.6.0');
  });

  describe('skipBundle', () => {
    it('uses a spec object as given', async () => {
      const resolved = await resolveSpec({ spec: openapi, skipBundle: true });

      expect(resolved.document).toBe(openapi);
      expect(loadAndBundleDefinition).not.toHaveBeenCalled();
    });

    it('rejects a spec URL', async () => {
      const error = await rejection(resolveSpec({ specUrl: '/cafe.yaml', skipBundle: true }));

      expect(error.stage).toBe('unsupported');
      expect(loadAndBundleDefinition).not.toHaveBeenCalled();
    });
  });

  it('rejects a bundle that is not an object', async () => {
    loadAndBundleDefinition.mockResolvedValue('plain text');

    const error = await rejection(resolveSpec({ spec: openapi, skipBundle: false }));

    expect(error.stage).toBe('unsupported');
  });

  describe('AsyncAPI conversion', () => {
    it('converts a 2.x document to 3.0 without changing the caller object', async () => {
      const spec = structuredClone(asyncapi2);

      const resolved = await resolveSpec({ spec, skipBundle: true });

      expect(resolved.convertedFrom).toBe('2.6.0');
      expect(resolved.document).toMatchObject({
        asyncapi: '3.0.0',
        operations: { orderPlaced: { action: 'send' } },
      });
      expect(spec).toEqual(asyncapi2);
    });

    it('converts a 2.x document loaded from a URL', async () => {
      loadAndBundleDefinition.mockResolvedValue(structuredClone(asyncapi2));

      const resolved = await resolveSpec({ specUrl: '/events.yaml', skipBundle: false });

      expect(resolved.convertedFrom).toBe('2.6.0');
      expect(resolved.document).toMatchObject({ asyncapi: '3.0.0' });
    });

    it('does not mark a 3.x document as converted', async () => {
      const resolved = await resolveSpec({
        spec: { asyncapi: '3.0.0', info: { title: 't', version: '1' } },
        skipBundle: true,
      });

      expect(resolved.convertedFrom).toBeUndefined();
    });
  });

  describe('spec URLs', () => {
    it('reports a failed request with its status', async () => {
      mockFetch({ ok: false, status: 404 });

      const error = await rejection(resolveSpec({ specUrl: '/schema.graphql', skipBundle: false }));

      expect(error).toMatchObject({ stage: 'fetch', httpStatus: 404 });
    });

    it('reports a network failure with status 0', async () => {
      mockFetch(new TypeError('Failed to fetch'));

      const error = await rejection(resolveSpec({ specUrl: '/schema.gql', skipBundle: false }));

      expect(error).toMatchObject({ stage: 'fetch', httpStatus: 0 });
    });

    it('reports a GraphQL syntax error in a .graphql file as a parse error', async () => {
      mockFetch({ ok: true, text: () => Promise.resolve('type Query {') });

      const error = await rejection(resolveSpec({ specUrl: '/schema.graphql', skipBundle: false }));

      expect(error.stage).toBe('parse');
    });
  });
});

describe('convertedFileName', () => {
  it.each([
    ['https://example.com/specs/events.yaml?v=2#top', 'events.yaml'],
    ['/specs/events.JSON', 'events.yaml'],
    ['/specs/events.yml', 'events.yaml'],
    ['/specs/events', 'events.yaml'],
    ['https://example.com/', 'asyncapi.yaml'],
  ])('%s → %s', (specUrl, expected) => {
    expect(convertedFileName(specUrl)).toBe(expected);
  });
});

describe('convertedDownloadUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('serves the document as YAML from a blob URL', async () => {
    const createObjectURL = vi.fn(() => 'blob:converted');
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = createObjectURL;
      },
    );

    expect(convertedDownloadUrl({ asyncapi: '3.0.0' })).toBe('blob:converted');
    const blob = createObjectURL.mock.lastCall?.[0] as Blob | undefined;
    expect(blob?.type).toBe('application/yaml');
    expect(await readText(blob)).toBe('asyncapi: 3.0.0\n');
  });

  it('returns undefined where blob URLs are unavailable', () => {
    vi.stubGlobal(
      'URL',
      class extends URL {
        static createObjectURL = undefined;
      },
    );

    expect(convertedDownloadUrl({ asyncapi: '3.0.0' })).toBeUndefined();
  });
});
