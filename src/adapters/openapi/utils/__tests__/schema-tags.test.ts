import { describe, it, expect } from 'vitest';

import type { OpenAPIDefinition } from '../../../../types/openapi.js';

import { getSchemaNamesForTags } from '../schema-tags.js';

function documentWithSchemas(schemas: Record<string, unknown>): OpenAPIDefinition {
  return {
    openapi: '3.0.0',
    info: { title: 'T', version: '1' },
    components: { schemas },
  } as unknown as OpenAPIDefinition;
}

describe('getSchemaNamesForTags', () => {
  const doc = documentWithSchemas({
    Alpha: { type: 'string' },
    Beta: { type: 'object', 'x-tags': ['Other'] },
    Gamma: { type: 'number', 'x-tags': ['Schemas', 'Other'] },
  });

  it('puts untagged schemas into schemaDefinitionsTagName and lists x-tagged schemas under matching tags', () => {
    expect(getSchemaNamesForTags(new Set(['Schemas']), doc, 'Schemas')).toEqual(['Alpha', 'Gamma']);
  });

  it('respects x-tags for other tags', () => {
    expect(getSchemaNamesForTags(new Set(['Other']), doc, 'Schemas')).toEqual(['Beta', 'Gamma']);
  });

  it('when schemaDefinitionsTagName is unset, only explicit x-tags assign schemas to tags', () => {
    expect(getSchemaNamesForTags(new Set(['Schemas']), doc, undefined)).toEqual(['Gamma']);
  });

  it('lists a schema once, in document order, when it matches several of the tags', () => {
    expect(getSchemaNamesForTags(new Set(['Other', 'Schemas']), doc, 'Schemas')).toEqual([
      'Alpha',
      'Beta',
      'Gamma',
    ]);
  });

  it('puts a schema with an empty x-tags into schemaDefinitionsTagName', () => {
    const document = documentWithSchemas({
      Empty: { type: 'object', 'x-tags': [] },
      Tagged: { type: 'object', 'x-tags': ['Other'] },
    });

    expect(getSchemaNamesForTags(new Set(['Schemas']), document, 'Schemas')).toEqual(['Empty']);
  });

  it('skips schemas that are not objects and treats an x-tags that is not a list as absent', () => {
    const document = documentWithSchemas({
      Missing: null,
      Text: 'not a schema',
      Loose: { type: 'object', 'x-tags': 'Other' },
    });

    expect(getSchemaNamesForTags(new Set(['Schemas']), document, 'Schemas')).toEqual(['Loose']);
  });
});
