import { describe, it, expect } from 'vitest';

import type { OpenAPIDefinition } from '../../../../../types/openapi.js';

import { processOpenApiDocument } from '../../../index.js';
import { collectAllItems } from '../../../../__tests__/utils.js';
import { getSchemaNamesForTag } from '../item.js';
import { normalizeOptions } from '../../../../../options/normalizeOptions.js';
import { markdocParser } from '../../../../../components/markdoc/markdocParser.js';

describe('getSchemaNamesForTag', () => {
  const doc = {
    openapi: '3.0.0',
    info: { title: 'T', version: '1' },
    components: {
      schemas: {
        Alpha: { type: 'string' },
        Beta: { type: 'object', 'x-tags': ['Other'] },
        Gamma: { type: 'number', 'x-tags': ['Schemas', 'Other'] },
      },
    },
  } as unknown as OpenAPIDefinition;

  it('puts untagged schemas into schemaDefinitionsTagName and lists x-tagged schemas under matching tags', () => {
    expect(getSchemaNamesForTag('Schemas', doc, 'Schemas')).toEqual(['Alpha', 'Gamma']);
  });

  it('respects x-tags for other tags', () => {
    expect(getSchemaNamesForTag('Other', doc, 'Schemas')).toEqual(['Beta', 'Gamma']);
  });

  it('when schemaDefinitionsTagName is unset, only explicit x-tags assign schemas to tags', () => {
    expect(getSchemaNamesForTag('Schemas', doc, undefined)).toEqual(['Gamma']);
  });
});

describe('buildOpenApiItems with schemaDefinitionsTagName', () => {
  it('creates schema sidebar links and item content', async () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'Schemas', description: 'Models' }],
      paths: {},
      components: {
        schemas: {
          Pet: { type: 'object', title: 'Pet', properties: { id: { type: 'string' } } },
        },
      },
    } as unknown as OpenAPIDefinition;

    const options = {
      ...normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        schemaDefinitionsTagName: 'Schemas',
      }),
      markdownParser: markdocParser,
    };

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/api',
      options,
    });

    const flat = collectAllItems(items);
    const schemaItems = flat.filter((i) => i.content?.itemVariant === 'schema');

    expect(schemaItems.length).toBe(1);
    expect(schemaItems[0]).toMatchObject({ type: 'link', label: 'Pet', httpVerb: 'schema' });
    expect(schemaItems[0]?.routeSlug).toContain('schemas');
    expect(schemaItems[0]?.routeSlug).toContain('pet');
  });

  it('injects Schemas tag like openapi-docs when it is not listed in spec tags', async () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'Events', description: 'E' }],
      paths: {
        '/e': {
          get: {
            tags: ['Events'],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      components: {
        schemas: {
          Pet: { type: 'object', title: 'Pet', properties: { id: { type: 'string' } } },
        },
      },
    } as unknown as OpenAPIDefinition;

    const options = {
      ...normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        schemaDefinitionsTagName: 'Schemas',
      }),
      markdownParser: markdocParser,
    };

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/api',
      options,
    });

    const flat = collectAllItems(items);
    const schemaItems = flat.filter((i) => i.content?.itemVariant === 'schema');
    const schemaGroup = items.find((i) => i.type === 'group' && i.label === 'Schemas');

    expect(schemaGroup).toBeDefined();
    expect(schemaItems.length).toBe(1);
    expect(schemaItems[0]).toMatchObject({ type: 'link', label: 'Pet', httpVerb: 'schema' });
  });

  it('renders the configured Schemas tag even when no schemas would land in it (matches openapi-docs)', async () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'Events', description: 'E' }],
      paths: {
        '/e': {
          get: {
            tags: ['Events'],
            responses: { '200': { description: 'ok' } },
          },
        },
      },
      components: {
        schemas: {
          Pet: { type: 'object', 'x-tags': ['Events'], title: 'Pet' },
        },
      },
    } as unknown as OpenAPIDefinition;

    const options = {
      ...normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        schemaDefinitionsTagName: 'Schemas',
      }),
      markdownParser: markdocParser,
    };

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/api',
      options,
    });

    const schemaGroup = items.find((i) => i.type === 'group' && i.label === 'Schemas');
    expect(schemaGroup).toBeDefined();
  });

  it('renders the configured Schemas tag even when the document has no schemas at all (matches openapi-docs)', async () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'Events' }],
      paths: {
        '/e': {
          get: { tags: ['Events'], responses: { '200': { description: 'ok' } } },
        },
      },
    } as unknown as OpenAPIDefinition;

    const options = {
      ...normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        schemaDefinitionsTagName: 'Schemas',
      }),
      markdownParser: markdocParser,
    };

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/api',
      options,
    });

    const schemaGroup = items.find((i) => i.type === 'group' && i.label === 'Schemas');
    expect(schemaGroup).toBeDefined();
  });

  it('does not render the Schemas tag when schemaDefinitionsTagName option is unset, even if schemas exist', async () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'Events' }],
      paths: {
        '/e': {
          get: { tags: ['Events'], responses: { '200': { description: 'ok' } } },
        },
      },
      components: {
        schemas: {
          Pet: { type: 'object', title: 'Pet' },
        },
      },
    } as unknown as OpenAPIDefinition;

    const options = {
      ...normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
      }),
      markdownParser: markdocParser,
    };

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/api',
      options,
    });

    const flat = collectAllItems(items);
    const schemaItems = flat.filter((i) => i.content?.itemVariant === 'schema');
    const schemaGroup = items.find((i) => i.type === 'group' && i.label === 'Schemas');

    expect(schemaGroup).toBeUndefined();
    expect(schemaItems).toHaveLength(0);
  });

  it('keeps the Schemas tag when it is declared at top level even when no schemas land in it', async () => {
    const document = {
      openapi: '3.0.0',
      info: { title: 'T', version: '1' },
      tags: [{ name: 'Events' }, { name: 'Schemas', description: 'Schema overview' }],
      paths: {
        '/e': {
          get: { tags: ['Events'], responses: { '200': { description: 'ok' } } },
        },
      },
      components: {
        schemas: {
          Pet: { type: 'object', 'x-tags': ['Events'], title: 'Pet' },
        },
      },
    } as unknown as OpenAPIDefinition;

    const options = {
      ...normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        schemaDefinitionsTagName: 'Schemas',
      }),
      markdownParser: markdocParser,
    };

    const { items } = await processOpenApiDocument({
      type: 'openapi',
      document,
      basePath: '/api',
      options,
    });

    const schemaGroup = items.find((i) => i.type === 'group' && i.label === 'Schemas');
    expect(schemaGroup).toBeDefined();
  });
});
