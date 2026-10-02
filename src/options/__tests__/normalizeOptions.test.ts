import { describe, it, expect } from 'vitest';

import { LayoutVariant } from '@redocly/config';

import { normalizeOptions } from '../normalizeOptions.js';
import { DEFAULT_LANGUAGES } from '../../utils/languages.js';
import type { RawApiDocsOptions } from '../../types/options.js';

function makeOpenApiRaw(overrides: Partial<RawApiDocsOptions> = {}): RawApiDocsOptions {
  return {
    specType: 'openapi',
    metadata: {},
    downloadUrls: [],
    ...overrides,
  };
}

describe('normalizeOptions', () => {
  describe('OpenAPI', () => {
    it('preserves specType and metadata', () => {
      const raw = makeOpenApiRaw({ metadata: { title: 'My API', description: 'Test' } });
      const result = normalizeOptions(raw);
      expect(result.specType).toBe('openapi');
      expect(result.metadata).toEqual({ title: 'My API', description: 'Test' });
    });

    it('applies OpenAPI defaults for minimal config', () => {
      const result = normalizeOptions(makeOpenApiRaw());
      expect(result.layout).toBe(LayoutVariant.THREE_PANEL);
      expect(result.hideDownloadButtons).toBe(false);
      expect(result.hideSchemaTitles).toBe(false);
      expect(result.sortRequiredPropsFirst).toBe(false);
      expect(result.onlyRequiredInSamples).toBe(false);
      expect(result.hidePropertiesPrefix).toBe(false);
      expect(result.jsonSamplesExpandLevel).toBe(2);
      expect(result.generatedSamplesMaxDepth).toBe(8);
      expect(result.maxDisplayedEnumValues).toBe(10);
      expect(result.basePath).toBe('');
      expect(result.ignoreNamedSchemas).toEqual(new Set());
      expect(result.codeSamples?.languages).toEqual(
        DEFAULT_LANGUAGES.map(({ key, label }) => ({ key, label, lang: label })),
      );
      expect(result.scrollYOffset?.()).toBe(0);
    });

    describe('downloadUrls', () => {
      it('adds title from filename for openapi yaml', () => {
        const result = normalizeOptions(
          makeOpenApiRaw({ downloadUrls: [{ url: 'https://example.com/spec/openapi.yaml' }] }),
        );
        expect(result.downloadUrls).toHaveLength(1);
        expect(result.downloadUrls?.[0]?.title).toBe('openapi.yaml');
        expect(result.downloadUrls?.[0]?.url).toBe('https://example.com/spec/openapi.yaml');
      });

      it('keeps existing title when provided', () => {
        const result = normalizeOptions(
          makeOpenApiRaw({ downloadUrls: [{ url: '/spec.yaml', title: 'My API Spec' }] }),
        );
        expect(result.downloadUrls?.[0]?.title).toBe('My API Spec');
      });

      it('uses fallback title when url has no recognizable extension', () => {
        const result = normalizeOptions(
          makeOpenApiRaw({ downloadUrls: [{ url: 'https://example.com/api' }] }),
        );
        expect(result.downloadUrls?.[0]?.title).toBe('openapi.yaml');
      });
    });

    it('normalizes schemaDefinitionsTagName and markdocOptions as pass-through values', () => {
      const result = normalizeOptions(
        makeOpenApiRaw({
          schemaDefinitionsTagName: 'Schemas',
        }),
      );
      expect(result.schemaDefinitionsTagName).toBe('Schemas');
    });

    it('falls back to routingBasePath when basePath is not set', () => {
      expect(normalizeOptions(makeOpenApiRaw({ routingBasePath: '/docs/' })).basePath).toBe(
        '/docs',
      );
      expect(
        normalizeOptions(makeOpenApiRaw({ basePath: '/base', routingBasePath: '/legacy' }))
          .basePath,
      ).toBe('/base');
    });

    it('normalizes boolean OpenAPI options', () => {
      const result = normalizeOptions(
        makeOpenApiRaw({
          hideDownloadButtons: true,
          hideSchemaTitles: true,
          onlyRequiredInSamples: true,
          sortRequiredPropsFirst: true,
          hidePropertiesPrefix: true,
        }),
      );
      expect(result.hideDownloadButtons).toBe(true);
      expect(result.hideSchemaTitles).toBe(true);
      expect(result.onlyRequiredInSamples).toBe(true);
      expect(result.sortRequiredPropsFirst).toBe(true);
      expect(result.hidePropertiesPrefix).toBe(true);
    });

    it('normalizes OpenAPI scalar options', () => {
      const result = normalizeOptions(
        makeOpenApiRaw({
          jsonSamplesExpandLevel: 'all',
          generatedSamplesMaxDepth: '5',
          maxDisplayedEnumValues: 12,
          layout: 'stacked',
          showExtensions: 'x-trace-id, x-request-id',
        }),
      );
      expect(result.jsonSamplesExpandLevel).toBe(Infinity);
      expect(result.generatedSamplesMaxDepth).toBe(5);
      expect(result.maxDisplayedEnumValues).toBe(12);
      expect(result.layout).toBe('stacked');
      expect(result.showExtensions).toEqual(['x-trace-id', 'x-request-id']);
    });

    it('normalizes ignoreNamedSchemas from string and array', () => {
      const fromString = normalizeOptions(
        makeOpenApiRaw({ ignoreNamedSchemas: 'foo, bar , baz' }),
      ).ignoreNamedSchemas;
      const fromArray = normalizeOptions(
        makeOpenApiRaw({ ignoreNamedSchemas: ['a', 'b'] }),
      ).ignoreNamedSchemas;
      expect(fromString).toEqual(new Set(['foo', 'bar', 'baz']));
      expect(fromArray).toEqual(new Set(['a', 'b']));
    });

  });

  describe('common defaults for non-OpenAPI', () => {
    it('applies default layout and feedback for graphql', () => {
      const raw: RawApiDocsOptions = {
        specType: 'graphql',
        downloadUrls: [{ url: 'https://example.com/schema.graphql' }],
        metadata: {},
      };
      const result = normalizeOptions(raw);
      expect(result.layout).toBe(LayoutVariant.THREE_PANEL);
    });

    it('applies default layout and feedback for asyncapi', () => {
      const raw: RawApiDocsOptions = {
        specType: 'asyncapi',
        downloadUrls: [{ url: 'https://example.com/asyncapi.yaml' }],
        metadata: {},
      };
      const result = normalizeOptions(raw);
      expect(result.layout).toBe(LayoutVariant.THREE_PANEL);
    });
  });

  describe('GraphQL', () => {
    it('applies graphql default values', () => {
      const raw: RawApiDocsOptions = {
        specType: 'graphql',
        downloadUrls: [{ url: '/schema.graphql' }],
        metadata: {},
      };
      const result = normalizeOptions(raw);
      expect(result.jsonSamplesDepth).toBe(1);
      expect(result.samplesMaxInlineArgs).toBe(2);
      expect(result.fieldExpandLevel).toBe(4);
      expect(result.layout).toBe(LayoutVariant.THREE_PANEL);
    });

    it('preserves specType and metadata', () => {
      const raw: RawApiDocsOptions = {
        specType: 'graphql',
        downloadUrls: [],
        metadata: { title: 'GraphQL API' },
      };
      const result = normalizeOptions(raw);
      expect(result.specType).toBe('graphql');
      expect(result.metadata).toEqual({ title: 'GraphQL API' });
    });

    it('allows overriding defaults', () => {
      const raw: RawApiDocsOptions = {
        specType: 'graphql',
        downloadUrls: [],
        metadata: {},
        jsonSamplesDepth: 3,
        samplesMaxInlineArgs: 5,
        fieldExpandLevel: 2,
      };
      const result = normalizeOptions(raw);
      expect(result.jsonSamplesDepth).toBe(3);
      expect(result.samplesMaxInlineArgs).toBe(5);
      expect(result.fieldExpandLevel).toBe(2);
    });
  });

  describe('AsyncAPI', () => {
    it('applies protocol and basePath defaults', () => {
      const raw: RawApiDocsOptions = {
        specType: 'asyncapi',
        downloadUrls: [],
        metadata: {},
        protocol: 'kafka',
      };
      const result = normalizeOptions(raw);
      expect(result.protocol).toBe('kafka');
      expect(result).toHaveProperty('basePath');
      expect(result.basePath).toBe('');
    });

    it('defaults protocol to undefined', () => {
      const raw: RawApiDocsOptions = {
        specType: 'asyncapi',
        downloadUrls: [],
        metadata: {},
      };
      const result = normalizeOptions(raw);
      expect(result.protocol).toBeUndefined();
    });

    it('defaults jsonSamplesDepth to 3 for asyncapi', () => {
      const raw: RawApiDocsOptions = {
        specType: 'asyncapi',
        downloadUrls: [],
        metadata: {},
      };
      expect(normalizeOptions(raw).jsonSamplesDepth).toBe(3);
    });

    it('preserves specType and metadata', () => {
      const raw: RawApiDocsOptions = {
        specType: 'asyncapi',
        downloadUrls: [],
        metadata: { title: 'Events API' },
      };
      const result = normalizeOptions(raw);
      expect(result.specType).toBe('asyncapi');
      expect(result.metadata).toEqual({ title: 'Events API' });
    });
  });

  describe('expansion levels', () => {
    it('leaves schemasExpansionLevel undefined while jsonSamplesExpandLevel takes a default', () => {
      const result = normalizeOptions(makeOpenApiRaw());
      expect(result.schemasExpansionLevel).toBeUndefined();
      expect(result.jsonSamplesExpandLevel).toBe(2);
    });

    it("resolves 'all' to Infinity on both", () => {
      const result = normalizeOptions(
        makeOpenApiRaw({ schemasExpansionLevel: 'all', jsonSamplesExpandLevel: 'all' }),
      );
      expect(result.schemasExpansionLevel).toBe(Infinity);
      expect(result.jsonSamplesExpandLevel).toBe(Infinity);
    });

    it('parses the string form an html attribute produces', () => {
      const result = normalizeOptions(
        makeOpenApiRaw({ schemasExpansionLevel: '3', jsonSamplesExpandLevel: '1' }),
      );
      expect(result.schemasExpansionLevel).toBe(3);
      expect(result.jsonSamplesExpandLevel).toBe(1);
    });
  });

  describe('boolean flags', () => {
    const FLAGS = [
      'hideLoading',
      'skipBundle',
      'hideSchemaPattern',
      'hideSchemaTitles',
      'hideDownloadButtons',
      'sanitize',
      'onlyRequiredInSamples',
      'hidePropertiesPrefix',
    ] as const;

    it.each(FLAGS)('%s defaults to false', (flag) => {
      expect(normalizeOptions(makeOpenApiRaw())[flag]).toBe(false);
    });

    // Attributes arrive as strings, and only the literal "false" reads as off.
    it.each(FLAGS)('%s treats every attribute string but "false" as true', (flag) => {
      const on = normalizeOptions(makeOpenApiRaw({ [flag]: '' } as Partial<RawApiDocsOptions>));
      const off = normalizeOptions(
        makeOpenApiRaw({ [flag]: 'false' } as Partial<RawApiDocsOptions>),
      );
      const truthyWord = normalizeOptions(
        makeOpenApiRaw({ [flag]: 'no' } as Partial<RawApiDocsOptions>),
      );
      expect(on[flag]).toBe(true);
      expect(off[flag]).toBe(false);
      expect(truthyWord[flag]).toBe(true);
    });
  });

  describe('legacy aliases', () => {
    it('accepts requiredPropsFirst as sortRequiredPropsFirst', () => {
      expect(
        normalizeOptions(makeOpenApiRaw({ requiredPropsFirst: true })).sortRequiredPropsFirst,
      ).toBe(true);
    });

    it('prefers the current name when both are present', () => {
      const result = normalizeOptions(
        makeOpenApiRaw({ sortRequiredPropsFirst: false, requiredPropsFirst: true }),
      );
      expect(result.sortRequiredPropsFirst).toBe(false);
    });
  });
});
