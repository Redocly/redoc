import { afterEach, describe, it, expect, vi } from 'vitest';

import { loadAndBundleDefinition } from '../loadAndBundleSpec.js';
import { prepareApiDocs } from '../../RedocStandalone.js';
import { collectReportedErrors } from '../../telemetry/reportError.js';

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

describe('loadAndBundleDefinition', () => {
  it('renders a description the bundler throws on, unbundled, and reports the error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const finish = collectReportedErrors();

    const { items, store } = await prepareApiDocs({
      spec: {
        openapi: '3.1.0',
        info: { title: 'Pets', version: '1.0.0' },
        paths: {
          '/pets': {
            get: {
              summary: 'List pets',
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        oneOf: [{ $ref: '#/components/schemas/Cat' }],
                        discriminator: null,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        components: { schemas: { Cat: { type: 'object' } } },
      },
    });

    expect(finish().map(({ id }) => id)).toEqual(['bundleDocument']);
    expect(JSON.stringify(items)).toContain('List pets');
    expect(store.buildErrors).toBeUndefined();
    vi.restoreAllMocks();
  });

  it.each([
    ['not an API description', { foo: 1 }, 'Unsupported specification'],
    ['an unsupported OpenAPI version', { openapi: '4.0.0', paths: {} }, 'Unsupported OpenAPI'],
  ])('still fails to load a document that is %s', async (_, spec, message) => {
    await expect(loadAndBundleDefinition(spec)).rejects.toThrow(message);
  });

  it('bundles an AsyncAPI 2.x spec object and leaves the input at 2.x', async () => {
    const spec = structuredClone(v2);

    const bundled = (await loadAndBundleDefinition(spec)) as Record<string, unknown>;

    expect(bundled.asyncapi).toBe('2.6.0');
    expect(spec.asyncapi).toBe('2.6.0');
    expect(spec.channels['light/measured'].subscribe).toBeDefined();
  });

  it.each([false, true])(
    'converts a 2.x spec to 3.0 and leaves the input at 2.x (skipBundle: %s)',
    async (skipBundle) => {
      const spec = structuredClone(v2);

      const { document } = await prepareApiDocs({ spec, options: { skipBundle } });
      const converted = document as Record<string, any>;

      expect(converted.asyncapi).toBe('3.0.0');
      expect(converted.servers.production).toMatchObject({
        host: 'broker.example.com:1883',
        pathname: '/v1',
      });
      expect(converted.operations.onLight).toMatchObject({
        action: 'send',
        channel: { $ref: '#/channels/light~1measured' },
      });
      expect(spec.asyncapi).toBe('2.6.0');
      expect(spec.channels['light/measured'].subscribe).toBeDefined();
    },
  );

  describe('relative spec URLs', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      window.history.replaceState(null, '', '/');
    });

    it('resolves a relative spec URL against the page, not the site root', async () => {
      window.history.replaceState(null, '', '/docs/sub/index.html');
      const fetchMock = vi.fn().mockResolvedValue(
        new Response('openapi: 3.1.0\ninfo: {title: T, version: "1"}\npaths: {}\n', {
          status: 200,
          headers: { 'content-type': 'application/yaml' },
        }),
      );
      vi.stubGlobal('fetch', fetchMock);

      await loadAndBundleDefinition('openapi.yaml');

      expect(String(fetchMock.mock.calls[0][0])).toBe(
        `${window.location.origin}/docs/sub/openapi.yaml`,
      );
    });

    it('resolves a relative $ref in an inline spec against the page', async () => {
      window.history.replaceState(null, '', '/docs/sub/index.html');
      const fetchMock = vi.fn().mockResolvedValue(
        new Response('type: object\nproperties: {id: {type: string}}\n', {
          status: 200,
          headers: { 'content-type': 'application/yaml' },
        }),
      );
      vi.stubGlobal('fetch', fetchMock);

      const bundled = (await loadAndBundleDefinition({
        openapi: '3.1.0',
        info: { title: 'T', version: '1' },
        paths: {},
        components: { schemas: { Pet: { $ref: 'schemas/pet.yaml' } } },
      })) as { components: { schemas: Record<string, Record<string, unknown>> } };

      expect(String(fetchMock.mock.calls[0][0])).toBe(
        `${window.location.origin}/docs/sub/schemas/pet.yaml`,
      );
      // the bundler hoists the external file into components
      expect(bundled.components.schemas.pet).toMatchObject({ type: 'object' });
    });
  });
});
