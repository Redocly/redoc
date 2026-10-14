import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { load } from 'js-yaml';

const loadAndBundleDefinition = vi.fn();

vi.mock('../utils/loadAndBundleSpec.js', () => ({
  loadAndBundleDefinition,
}));

const { prepareApiDocs } = await import('../RedocStandalone.js');

/** Carries an external `$ref`, so a bundle pass would visibly rewrite it. */
const definition = {
  openapi: '3.1.0',
  info: { title: 'Skip Bundle Probe', version: '1.0.0' },
  paths: {
    '/drinks': {
      get: {
        operationId: 'listDrinks',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': { schema: { $ref: './schemas/drink.yaml' } },
            },
          },
        },
      },
    },
  },
};

describe('skipBundle', () => {
  beforeEach(() => {
    loadAndBundleDefinition.mockReset();
    loadAndBundleDefinition.mockResolvedValue({
      ...definition,
      'x-bundled': true,
    });
  });

  it('bundles the definition by default', async () => {
    const prepared = await prepareApiDocs({ spec: definition });

    expect(loadAndBundleDefinition).toHaveBeenCalledTimes(1);
    expect(prepared.document).toHaveProperty('x-bundled', true);
  });

  it('uses the definition as-is when enabled', async () => {
    const prepared = await prepareApiDocs({ spec: definition, options: { skipBundle: true } });

    expect(loadAndBundleDefinition).not.toHaveBeenCalled();
    expect(prepared.document).toBe(definition);
  });

  it('accepts the string form an html attribute produces', async () => {
    await prepareApiDocs({
      spec: definition,
      options: { skipBundle: 'true' } as unknown as { skipBundle: boolean },
    });

    expect(loadAndBundleDefinition).not.toHaveBeenCalled();
  });

  it('accepts a JSON string definition and detects its type once', async () => {
    const prepared = await prepareApiDocs({
      spec: JSON.stringify(definition),
      options: { skipBundle: true },
    });

    expect(loadAndBundleDefinition).not.toHaveBeenCalled();
    expect(prepared.specType).toBe('openapi');
    expect(prepared.document).toEqual(definition);
  });

  it('rejects being enabled without a definition object', async () => {
    await expect(
      prepareApiDocs({ specUrl: '/openapi.yaml', options: { skipBundle: true } }),
    ).rejects.toThrow('"spec" must be an object, JSON or YAML text when "skipBundle" is enabled');

    expect(loadAndBundleDefinition).not.toHaveBeenCalled();
  });
});

describe('AsyncAPI 2.x', () => {
  const v2 = {
    asyncapi: '2.6.0',
    info: { title: 'Lights', version: '1.0.0' },
    servers: { production: { url: 'mqtt://broker.example.com:1883/v1', protocol: 'mqtt' } },
    channels: {
      'light/measured': {
        subscribe: { operationId: 'onLight', message: { payload: { type: 'string' } } },
      },
    },
  };

  beforeEach(() => {
    loadAndBundleDefinition.mockReset();
    loadAndBundleDefinition.mockImplementation(async (source: unknown) =>
      typeof source === 'string' ? v2 : source,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([false, true])(
    'converts the document to 3.0 without changing the input (skipBundle: %s)',
    async (skipBundle) => {
      const spec = structuredClone(v2);
      const prepared = await prepareApiDocs({ spec, options: { skipBundle } });
      const document = prepared.document as {
        asyncapi: string;
        servers: Record<string, unknown>;
        operations: Record<string, unknown>;
      };

      expect(document.asyncapi).toBe('3.0.0');
      expect(document.servers.production).toMatchObject({
        host: 'broker.example.com:1883',
        pathname: '/v1',
      });
      expect(document.operations.onLight).toMatchObject({
        action: 'send',
        channel: { $ref: '#/channels/light~1measured' },
      });
      expect(spec).toEqual(v2);
    },
  );

  it('offers the converted document for download instead of the 2.x spec URL', async () => {
    const blobs: Blob[] = [];
    URL.createObjectURL ??= () => '';
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      blobs.push(blob as Blob);
      return 'blob:converted';
    });

    const prepared = await prepareApiDocs({ specUrl: '/specs/lights.json?v=1' });

    expect(prepared.options.downloadUrls).toEqual([
      { url: 'blob:converted', title: 'lights.yaml' },
    ]);
    const text = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsText(blobs[0]);
    });
    expect(load(text)).toEqual(prepared.document);
  });

  it('creates no converted file when the default download is not used', async () => {
    URL.createObjectURL ??= () => '';
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:converted');

    await prepareApiDocs({ spec: structuredClone(v2) });
    await prepareApiDocs({
      specUrl: '/specs/lights.yaml',
      options: { downloadUrls: [{ url: '/specs/lights-2.6.yaml' }] },
    });
    await prepareApiDocs({ specUrl: '/specs/lights.yaml', convertedDownload: false });

    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it('keeps the default download when downloadUrls has no usable entry', async () => {
    const prepared = await prepareApiDocs({
      specUrl: '/specs/lights.yaml',
      options: { downloadUrls: "[{'url':'b.yaml'}]" as never, skipBundle: false },
      convertedDownload: false,
    });

    expect(prepared.options.downloadUrls).toEqual([
      { url: new URL('/specs/lights.yaml', document.baseURI).href },
    ]);
  });

  it('keeps explicit downloadUrls', async () => {
    const downloadUrls = [{ url: '/specs/lights-2.6.yaml', title: 'Original' }];

    const prepared = await prepareApiDocs({
      specUrl: '/specs/lights.yaml',
      options: { downloadUrls },
    });

    expect(prepared.options.downloadUrls).toBe(downloadUrls);
  });
});
