import { describe, it, expect } from 'vitest';

import type { OpenAPIDefinition } from '../../../types/openapi.js';

import { processOpenApiDocument } from '../index.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { markdocParser } from '../../../components/markdoc/markdocParser.js';

const options = {
  ...normalizeOptions({ specType: 'openapi', downloadUrls: [], metadata: {} }),
  markdownParser: markdocParser,
};

type ContentNode = {
  variant?: string;
  parameters?: { name: string; schemaId?: string }[];
  mediaTypeSchemas?: Record<string, { schemaId?: string; exampleIds?: string[] }>;
  responses?: {
    code: string;
    mediaTypeContent?: Record<string, { schemaId?: string; exampleIds?: string[] }>;
  }[];
};

function findContentNode(value: unknown, variant: string): ContentNode | undefined {
  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = findContentNode(entry, variant);
      if (found) return found;
    }
    return undefined;
  }
  if (!value || typeof value !== 'object') return undefined;
  if ('nodeType' in value && 'variant' in value && value.variant === variant) return value;
  return findContentNode(Object.values(value), variant);
}

function buildDocument(mediaTypes: Record<string, unknown>) {
  const userBody = { $ref: '#/components/mediaTypes/UserBody' };
  return {
    openapi: '3.2.0',
    info: { title: 'components.mediaTypes', version: '1' },
    paths: {
      '/users': {
        post: {
          operationId: 'createUser',
          parameters: [{ name: 'filter', in: 'query', content: { 'application/json': userBody } }],
          requestBody: { content: { 'application/json': userBody } },
          responses: {
            '201': { description: 'created', content: { 'application/json': userBody } },
          },
        },
      },
    },
    components: {
      mediaTypes,
      schemas: { User: { type: 'object', properties: { name: { type: 'string' } } } },
    },
  } as unknown as OpenAPIDefinition;
}

const userBodyMediaType = {
  schema: { $ref: '#/components/schemas/User' },
  example: { name: 'Ann' },
};

async function render(document: OpenAPIDefinition) {
  const { items, store } = await processOpenApiDocument({
    type: 'openapi',
    document,
    basePath: '/api',
    options,
  });
  return {
    store,
    query: findContentNode(items, 'query'),
    body: findContentNode(items, 'body'),
    responses: findContentNode(items, 'responses'),
  };
}

describe('media type entries referencing components/mediaTypes (OpenAPI 3.2)', () => {
  it('renders the referenced schema and example for parameters, request body and responses', async () => {
    const { store, query, body, responses } = await render(
      buildDocument({ UserBody: userBodyMediaType }),
    );

    const paramSchemaId = query?.parameters?.[0]?.schemaId;
    expect(paramSchemaId && store.schemaStore[paramSchemaId]?.data).toEqual({
      $ref: '#/components/schemas/User',
    });

    const bodyEntry = body?.mediaTypeSchemas?.['application/json'];
    expect(bodyEntry?.schemaId).toBe('components/schemas/User');
    expect(bodyEntry?.exampleIds).toHaveLength(1);

    const responseEntry = responses?.responses?.[0]?.mediaTypeContent?.['application/json'];
    expect(responseEntry?.schemaId).toBe('components/schemas/User');
    expect(responseEntry?.exampleIds).toHaveLength(1);

    const exampleIds = [...(bodyEntry?.exampleIds ?? []), ...(responseEntry?.exampleIds ?? [])];
    expect(exampleIds.map((id) => store.exampleStore[id]?.value)).toEqual([
      { name: 'Ann' },
      { name: 'Ann' },
    ]);
  });

  it('follows a chain of media type references', async () => {
    const { body } = await render(
      buildDocument({
        UserBody: { $ref: '#/components/mediaTypes/UserBodyV2' },
        UserBodyV2: userBodyMediaType,
      }),
    );

    expect(body?.mediaTypeSchemas?.['application/json']?.schemaId).toBe('components/schemas/User');
  });
});
