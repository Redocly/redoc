import { describe, expect, it } from 'vitest';

import { cloneStrip } from '../clone-strip.js';

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.freeze(value);
    for (const entry of Object.values(value)) deepFreeze(entry);
  }
  return value;
}

function expectDefined<T>(value: T | null | undefined): T {
  expect(value).toBeDefined();
  expect(value).not.toBeNull();
  return value as T;
}

const noInline: ReadonlyMap<string, unknown> = new Map();

describe('cloneStrip', () => {
  it('returns a deep clone sharing no object identity with the source', () => {
    const source = deepFreeze({
      info: { title: 'Pets', contact: { name: 'Team' } },
      tags: [{ name: 'pets' }, { name: 'store' }],
    });

    const result = cloneStrip(source, noInline) as typeof source;

    expect(result).toEqual(source);
    expect(result).not.toBe(source);
    expect(result.info).not.toBe(source.info);
    expect(result.info.contact).not.toBe(source.info.contact);
    expect(result.tags).not.toBe(source.tags);
    expect(result.tags[0]).not.toBe(source.tags[0]);

    result.info.title = 'Changed';
    result.tags.push({ name: 'added' });
    expect(source.info.title).toBe('Pets');
    expect(source.tags).toHaveLength(2);
  });

  it('removes stripped keys at every depth, including inside arrays of objects', () => {
    const source = deepFreeze({
      paths: {
        '/pets': {
          get: { responses: { '200': { description: 'ok', 'x-circular-ref': '#/loop' } } },
        },
      },
      tags: [
        {
          name: 'pets',
          'x-original-ref': '#/tags/0',
        },
        { name: 'store' },
      ],
    });

    const result = cloneStrip(source, noInline);

    expect(result).toEqual({
      paths: {
        '/pets': {
          get: { responses: { '200': { description: 'ok' } } },
        },
      },
      tags: [{ name: 'pets' }, { name: 'store' }],
    });
  });

  it('drops entries whose value is undefined while keeping null', () => {
    const source = deepFreeze({
      keep: 1,
      gone: undefined,
      nested: { alsoGone: undefined, kept: null },
    });

    const result = cloneStrip(source, noInline) as Record<string, unknown>;

    expect(result).toEqual({ keep: 1, nested: { kept: null } });
    expect(Object.keys(result)).toEqual(['keep', 'nested']);
  });

  it('passes primitives and null through unchanged', () => {
    expect(cloneStrip('text', noInline)).toBe('text');
    expect(cloneStrip(42, noInline)).toBe(42);
    expect(cloneStrip(true, noInline)).toBe(true);
    expect(cloneStrip(null, noInline)).toBeNull();
    expect(cloneStrip(undefined, noInline)).toBeUndefined();
  });

  it('preserves array structure and strips keys inside array elements', () => {
    const source = deepFreeze([1, 'two', null, [{ type: 'object', 'x-circular-ref': '#/x' }]]);

    const result = cloneStrip(source, noInline);

    expect(result).toEqual([1, 'two', null, [{ type: 'object' }]]);
    expect(result).not.toBe(source);
  });

  it('inlines a $ref from inlineTargets, merging siblings over the target content', () => {
    const target = deepFreeze({
      type: 'object',
      title: 'From target',
      properties: { id: { type: 'string' } },
    });
    const inlineTargets = new Map<string, unknown>([['#/x-shared/Thing', target]]);
    const source = deepFreeze({
      schema: {
        $ref: '#/x-shared/Thing',
        title: 'Sibling wins',
        description: 'kept sibling',
        skipped: undefined,
      },
    });

    const result = cloneStrip(source, inlineTargets) as Record<string, unknown>;

    expect(result).toEqual({
      schema: {
        type: 'object',
        title: 'Sibling wins',
        description: 'kept sibling',
        properties: { id: { type: 'string' } },
      },
    });
    const schema = result.schema as Record<string, unknown>;
    expect(schema.properties).not.toBe(target.properties);
  });

  it('keeps a $ref verbatim when it is not an inline target', () => {
    const inlineTargets = new Map<string, unknown>([['#/other', { type: 'object' }]]);
    const source = deepFreeze({
      schema: { $ref: '#/components/schemas/Pet', summary: 'kept' },
    });

    const result = cloneStrip(source, inlineTargets);

    expect(result).toEqual({
      schema: { $ref: '#/components/schemas/Pet', summary: 'kept' },
    });
  });

  it('recursively inlines targets that themselves reference inline targets', () => {
    const inlineTargets = new Map<string, unknown>([
      ['#/x-shared/Outer', { type: 'object', properties: { inner: { $ref: '#/x-shared/Inner' } } }],
      ['#/x-shared/Inner', { type: 'string' }],
    ]);
    deepFreeze([...inlineTargets.values()]);
    const source = deepFreeze({ schema: { $ref: '#/x-shared/Outer' } });

    const result = cloneStrip(source, inlineTargets);

    expect(result).toEqual({
      schema: { type: 'object', properties: { inner: { type: 'string' } } },
    });
  });

  it('collapses a self-recursive inline target to an empty object', () => {
    const inlineTargets = new Map<string, unknown>([
      ['#/x-shared/Node', { type: 'object', properties: { child: { $ref: '#/x-shared/Node' } } }],
    ]);
    deepFreeze([...inlineTargets.values()]);
    const source = deepFreeze({ schema: { $ref: '#/x-shared/Node' } });

    const result = cloneStrip(source, inlineTargets);

    expect(result).toEqual({
      schema: { type: 'object', properties: { child: {} } },
    });
  });

  it('collapses mutually recursive inline targets instead of recursing forever', () => {
    const inlineTargets = new Map<string, unknown>([
      ['#/x-shared/A', { name: 'a', next: { $ref: '#/x-shared/B' } }],
      ['#/x-shared/B', { name: 'b', next: { $ref: '#/x-shared/A' } }],
    ]);
    deepFreeze([...inlineTargets.values()]);
    const source = deepFreeze({ root: { $ref: '#/x-shared/A' } });

    const result = cloneStrip(source, inlineTargets);

    expect(result).toEqual({
      root: { name: 'a', next: { name: 'b', next: {} } },
    });
  });

  it('inlines the same target again inside a sibling of an inlining node', () => {
    const inlineTargets = new Map<string, unknown>([['#/x-shared/T', { type: 'string' }]]);
    deepFreeze([...inlineTargets.values()]);
    const source = deepFreeze({
      root: { $ref: '#/x-shared/T', extra: { $ref: '#/x-shared/T' } },
    });

    const result = cloneStrip(source, inlineTargets);

    expect(result).toEqual({
      root: { type: 'string', extra: { type: 'string' } },
    });
  });

  it('inlines the same target for every non-nested occurrence', () => {
    const inlineTargets = new Map<string, unknown>([['#/x-shared/T', { type: 'string' }]]);
    deepFreeze([...inlineTargets.values()]);
    const source = deepFreeze({
      one: { $ref: '#/x-shared/T' },
      two: { $ref: '#/x-shared/T' },
    });

    const result = cloneStrip(source, inlineTargets) as Record<string, unknown>;

    expect(result).toEqual({ one: { type: 'string' }, two: { type: 'string' } });
    expect(result.one).not.toBe(result.two);
  });

  it('replaces the ref node entirely when the inline target is not a record', () => {
    const targetArray = deepFreeze([{ type: 'string' }]);
    const inlineTargets = new Map<string, unknown>([
      ['#/x-shared/Text', 'plain text'],
      ['#/x-shared/Count', 7],
      ['#/x-shared/List', targetArray],
    ]);
    const source = deepFreeze({
      text: { $ref: '#/x-shared/Text', description: 'discarded' },
      count: { $ref: '#/x-shared/Count' },
      list: { $ref: '#/x-shared/List' },
    });

    const result = cloneStrip(source, inlineTargets) as Record<string, unknown>;

    expect(result).toEqual({
      text: 'plain text',
      count: 7,
      list: [{ type: 'string' }],
    });
    expect(result.list).not.toBe(targetArray);
  });

  it('throws on a circular object graph', () => {
    const node: Record<string, unknown> = { name: 'root' };
    node.child = { parent: node };

    expect(() => cloneStrip(node, noInline)).toThrow(/circular object graph/);
  });

  it('throws on a cycle that passes through an array', () => {
    const root: Record<string, unknown> = { name: 'root' };
    root.items = [root];

    expect(() => cloneStrip(root, noInline)).toThrow(/circular object graph/);
  });

  it('does not throw when the same object appears twice as siblings', () => {
    const shared = deepFreeze({ type: 'string' });
    const source = deepFreeze({ first: shared, second: shared, list: [shared, shared] });

    const result = cloneStrip(source, noInline) as Record<string, unknown>;

    expect(result).toEqual({
      first: { type: 'string' },
      second: { type: 'string' },
      list: [{ type: 'string' }, { type: 'string' }],
    });
    expect(expectDefined(result.first)).not.toBe(shared);
    expect(result.first).not.toBe(result.second);
  });
});
