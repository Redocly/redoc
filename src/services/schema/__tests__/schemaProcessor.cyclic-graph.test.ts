import type { merge as mergeSchemas } from '@redocly/allof-merge';

import { describe, it, expect, vi } from 'vitest';

import type { Document, SchemaNode } from '../../../types/schema.js';

import { schemaProcessor } from '../schemaProcessor.js';

const mergeCalls = vi.hoisted(() => ({ count: 0 }));
vi.mock('@redocly/allof-merge', async (importOriginal) => {
  const actual = await importOriginal<{ merge: typeof mergeSchemas }>();
  const merge: typeof mergeSchemas = (...args) => {
    mergeCalls.count++;
    return actual.merge(...args);
  };
  return { ...actual, merge };
});

function makeDocument(components: Record<string, SchemaNode>): Document {
  return {
    openapi: '3.1.0',
    info: { title: '', version: '1.0' },
    paths: {},
    components: { schemas: components },
  } as Document;
}

const refTo = (name: string): SchemaNode => ({ $ref: `#/components/schemas/${name}` });

function processPage(doc: Document, name: string) {
  return schemaProcessor(refTo(name), doc, { rootJsonPointer: `#/components/schemas/${name}` });
}

// Every entity links to every other entity through a property, so every path through
// the graph closes a different cycle.
function denseGraph(size: number): Document {
  const names = Array.from({ length: size }, (_, i) => `Entity${i}`);
  const schemas: Record<string, SchemaNode> = {};
  for (const name of names) {
    const properties: Record<string, SchemaNode> = { id: { type: 'string' } };
    for (const other of names) if (other !== name) properties[other] = refTo(other);
    schemas[name] = { type: 'object', properties };
  }
  return makeDocument(schemas);
}

// Entities linked through discriminator hosts whose inline variant embeds another entity,
// so the whole graph is reachable from every listed variant.
function entityGraph(entities: number, links: number): Document {
  const schemas: Record<string, SchemaNode> = {
    Reference: { type: 'object', properties: { uuid: { type: 'string' } } },
  };
  for (let i = 0; i < entities; i++) {
    const properties: Record<string, SchemaNode> = { id: { type: 'string' } };
    for (let j = 0; j < links; j++) {
      const target = `Entity${(i + j + 1) % entities}`;
      properties[`link${j}`] = refTo(`Entity${i}Link${j}`);
      schemas[`Entity${i}Link${j}`] = {
        type: 'object',
        discriminator: {
          propertyName: 'kind',
          mapping: {
            inline: `#/components/schemas/${target}Inline`,
            reference: '#/components/schemas/Reference',
          },
        },
        oneOf: [refTo(`${target}Inline`), refTo('Reference')],
      };
    }
    schemas[`Entity${i}`] = { type: 'object', properties };
    schemas[`Entity${i}Inline`] = { type: 'object', properties: { entity: refTo(`Entity${i}`) } };
  }
  return makeDocument(schemas);
}

describe('schemaProcessor on cyclic schema graphs', () => {
  it('resolves every ref of a dense entity graph once, so the page stays fast', () => {
    const start = performance.now();
    const result = processPage(denseGraph(12), 'Entity0');
    expect(Object.keys(result.properties ?? {})).toHaveLength(12);
    // 12 entities means 12! distinct paths when refs inside cycles are not cached
    expect(performance.now() - start).toBeLessThan(1000);
  });

  it('does not cache a bare alias that resolved to a cycle stub', () => {
    const doc = makeDocument({
      X: { type: 'object', properties: { name: { type: 'string' }, alias: refTo('XAlias') } },
      XAlias: refTo('X'),
      Root: { type: 'object', properties: { x: refTo('X'), y: refTo('XAlias') } },
    });
    const props = processPage(doc, 'Root').properties ?? {};
    expect(props['x']?.properties?.['alias']?.isCircular).toBe(true);
    expect(props['y']?.isCircular).toBeUndefined();
    expect(props['y']?.properties?.['name']?.type).toBe('string');
  });

  it('merges the page once and reuses its listed discriminator variants', () => {
    mergeCalls.count = 0;
    const result = processPage(entityGraph(12, 4), 'Entity0');
    expect(
      result.properties?.['link0']?.switcher?.options['inline']?.properties?.['entity'],
    ).toBeDefined();
    expect(mergeCalls.count).toBe(1);
  });

  it('keeps the inherited fields of a listed variant when the host itself is composed', () => {
    const doc = makeDocument({
      Base: { type: 'object', properties: { id: { type: 'string' } } },
      Pet: {
        allOf: [refTo('Base')],
        discriminator: { propertyName: 'petType', mapping: { cat: '#/components/schemas/Cat' } },
        oneOf: [refTo('Cat')],
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        allOf: [refTo('Pet'), { type: 'object', properties: { huntingSkill: { type: 'string' } } }],
      },
    });
    const cat = processPage(doc, 'Pet').switcher?.options['cat'];
    expect(Object.keys(cat?.properties ?? {}).sort()).toEqual(['huntingSkill', 'id', 'petType']);
  });

  it('resolves a listed variant on its own when a nested allOf closed on the composed host', () => {
    const doc = makeDocument({
      Base: { type: 'object', properties: { id: { type: 'string' } } },
      Pet: {
        allOf: [refTo('Base')],
        discriminator: { propertyName: 'petType', mapping: { cat: '#/components/schemas/Cat' } },
        oneOf: [refTo('Cat')],
        properties: { petType: { type: 'string' } },
      },
      Cat: {
        type: 'object',
        properties: {
          parent: { allOf: [refTo('Pet')] },
          owner: {
            allOf: [refTo('Pet'), { type: 'object', properties: { note: { type: 'string' } } }],
          },
        },
      },
    });
    const cat = processPage(doc, 'Pet').switcher?.options['cat'];
    expect(cat?.properties?.['parent']?.isCircular).toBe(true);
    expect(cat?.properties?.['owner']?.isCircular).toBe(true);
  });

  it('resolves a listed variant on its own when its list entry is a cycle stub', () => {
    const doc = makeDocument({
      Meta: { type: 'object', properties: { createdAt: { type: 'string' } } },
      Root: {
        type: 'object',
        discriminator: { propertyName: 'kind' },
        oneOf: [refTo('A'), refTo('B')],
        properties: { kind: { type: 'string' }, meta: refTo('Meta') },
      },
      A: { allOf: [refTo('Root'), { type: 'object', properties: { a: { type: 'string' } } }] },
      B: { allOf: [refTo('Root'), { type: 'object', properties: { b: { type: 'string' } } }] },
    });
    const a = processPage(doc, 'Root').switcher?.options['A'];
    expect(a?.isCircular).toBeUndefined();
    expect(a?.properties?.['a']?.type).toBe('string');
    expect(a?.properties?.['kind']?.type).toBe('string');
    expect(a?.properties?.['meta']?.properties?.['createdAt']?.type).toBe('string');
  });
});
