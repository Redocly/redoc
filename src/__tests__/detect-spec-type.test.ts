import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const loadAndBundleDefinition = vi.fn();

vi.mock('../utils/loadAndBundleSpec.js', () => ({
  loadAndBundleDefinition,
}));

const { prepareApiDocs } = await import('../RedocStandalone.js');

const SDL = 'type Query { beans: [String] }';
const openapi = { openapi: '3.1.0', info: { title: 'Cafe', version: '1.0.0' }, paths: {} };
const asyncapi = {
  asyncapi: '3.0.0',
  info: { title: 'Cafe events', version: '1.0.0' },
  channels: {},
};

function mockFetchText(text: string): void {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ text: () => Promise.resolve(text) }));
}

describe('spec type detection', () => {
  beforeEach(() => {
    loadAndBundleDefinition.mockReset();
    loadAndBundleDefinition.mockImplementation((source: unknown) => Promise.resolve(source));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('classifies a spec object by its shape', async () => {
    expect((await prepareApiDocs({ spec: openapi })).specType).toBe('openapi');
    expect((await prepareApiDocs({ spec: asyncapi })).specType).toBe('asyncapi');
  });

  it('parses a JSON string once and classifies the result', async () => {
    const prepared = await prepareApiDocs({ spec: JSON.stringify(asyncapi) });

    expect(prepared.specType).toBe('asyncapi');
    expect(loadAndBundleDefinition).toHaveBeenCalledWith(asyncapi);
  });

  it('treats any other string as GraphQL SDL', async () => {
    const prepared = await prepareApiDocs({ spec: SDL });

    expect(prepared.specType).toBe('graphql');
    expect(prepared.document).toBe(SDL);
    expect(loadAndBundleDefinition).not.toHaveBeenCalled();
  });

  it('fetches a .graphql URL as SDL without bundling', async () => {
    mockFetchText(SDL);

    const prepared = await prepareApiDocs({ specUrl: '/specs/cafe.GraphQL?v=2' });

    expect(prepared.specType).toBe('graphql');
    expect(loadAndBundleDefinition).not.toHaveBeenCalled();
  });

  it('decides the type of a plain URL after bundling', async () => {
    loadAndBundleDefinition.mockResolvedValue(asyncapi);

    const prepared = await prepareApiDocs({ specUrl: '/specs/events.yaml' });

    expect(prepared.specType).toBe('asyncapi');
  });

  it('falls back to GraphQL SDL when a URL cannot be bundled', async () => {
    loadAndBundleDefinition.mockRejectedValue(new Error('not yaml'));
    mockFetchText(SDL);

    const prepared = await prepareApiDocs({ specUrl: '/graphql/schema' });

    expect(prepared.specType).toBe('graphql');
  });

  it('reports the bundling error when the fallback is not GraphQL either', async () => {
    loadAndBundleDefinition.mockRejectedValue(new Error('not yaml'));
    mockFetchText('not a schema');

    await expect(prepareApiDocs({ specUrl: '/broken.yaml' })).rejects.toThrow('not yaml');
  });

  it('explains when the spec URL is served as an HTML page', async () => {
    loadAndBundleDefinition.mockRejectedValue(new Error('not yaml'));
    mockFetchText('<!doctype html><html><body>not a schema</body></html>');

    await expect(prepareApiDocs({ specUrl: '/missing.yaml' })).rejects.toThrow(
      '/missing.yaml returned an HTML page instead of an API description',
    );
  });

  it('rejects GraphQL introspection results instead of reporting them as OpenAPI', async () => {
    await expect(prepareApiDocs({ spec: { __schema: {} } })).rejects.toThrow(/introspection/);
    await expect(prepareApiDocs({ spec: '{"data":{"__schema":{}}}' })).rejects.toThrow(
      /introspection/,
    );
  });

  it('rejects JSON that is not an object', async () => {
    await expect(prepareApiDocs({ spec: '[1, 2]' })).rejects.toThrow(/object/);
  });

  it('requires a spec or a URL', async () => {
    await expect(prepareApiDocs({})).rejects.toThrow(/spec/);
  });
});
