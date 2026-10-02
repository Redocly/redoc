import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    ).rejects.toThrow('"spec" must be an object when "skipBundle" is enabled');

    expect(loadAndBundleDefinition).not.toHaveBeenCalled();
  });
});
