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

const noRefTargets: ReadonlyMap<string, Record<string, unknown>> = new Map();

describe('cloneStrip', () => {
  it('returns a deep clone sharing no object identity with the source', () => {
    const source = deepFreeze({
      info: { title: 'Pets', contact: { name: 'Team' } },
      tags: [{ name: 'pets' }, { name: 'store' }],
    });

    const result = cloneStrip(source, noRefTargets) as typeof source;

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

    const result = cloneStrip(source, noRefTargets);

    expect(result).toEqual({
      paths: {
        '/pets': {
          get: { responses: { '200': { description: 'ok' } } },
        },
      },
      tags: [{ name: 'pets' }, { name: 'store' }],
    });
  });

  it('removes stored credential extensions from security schemes', () => {
    const source = deepFreeze({
      components: {
        securitySchemes: {
          oauth: {
            type: 'oauth2',
            'x-defaultClientId': 'client',
            'x-defaultClientSecret': 'secret',
            'x-serverValues': { 'https://api.example.com': { password: 'pw' } },
            flows: { password: { tokenUrl: '/token', 'x-defaultPassword': 'pw', scopes: {} } },
          },
        },
      },
    });

    expect(cloneStrip(source, noRefTargets)).toEqual({
      components: {
        securitySchemes: {
          oauth: { type: 'oauth2', flows: { password: { tokenUrl: '/token', scopes: {} } } },
        },
      },
    });
  });

  it('drops entries whose value is undefined while keeping null', () => {
    const source = deepFreeze({
      keep: 1,
      gone: undefined,
      nested: { alsoGone: undefined, kept: null },
    });

    const result = cloneStrip(source, noRefTargets);

    expect(result).toEqual({ keep: 1, nested: { kept: null } });
    expect(Object.keys(result)).toEqual(['keep', 'nested']);
  });

  it('passes primitive values through unchanged', () => {
    const source = deepFreeze({ text: 'text', count: 42, flag: true, nothing: null });

    expect(cloneStrip(source, noRefTargets)).toEqual(source);
  });

  it('preserves array structure and strips keys inside array elements', () => {
    const source = deepFreeze({
      list: [1, 'two', null, [{ type: 'object', 'x-circular-ref': '#/x' }]],
    });

    const result = cloneStrip(source, noRefTargets);

    expect(result).toEqual({ list: [1, 'two', null, [{ type: 'object' }]] });
    expect(result.list).not.toBe(source.list);
  });

  it('keeps a $ref as written and copies its target to the address the $ref names', () => {
    const target = deepFreeze({ type: 'object', title: 'Thing', 'x-circular-ref': '#/x' });
    const refTargets = new Map([['#/x-defs/d0', target]]);
    const source = deepFreeze({ schema: { $ref: '#/x-defs/d0', description: 'Mine' } });

    const result = cloneStrip(source, refTargets);

    expect(result).toEqual({
      schema: { $ref: '#/x-defs/d0', description: 'Mine' },
      'x-defs': { d0: { type: 'object', title: 'Thing' } },
    });
    expect((result['x-defs'] as Record<string, unknown>).d0).not.toBe(target);
  });

  it('creates the parents of a nested address and decodes ~1 and ~0 in it', () => {
    const refTargets = new Map([['#/paths/~1pets~0all/get/responses/200', { description: 'ok' }]]);
    const source = deepFreeze({ schema: { $ref: '#/paths/~1pets~0all/get/responses/200' } });

    const result = cloneStrip(source, refTargets);

    expect(result.paths).toEqual({
      '/pets~all': { get: { responses: { '200': { description: 'ok' } } } },
    });
  });

  it('adds a target next to what the copy already holds under the same parent', () => {
    const refTargets = new Map([['#/paths/~1pets/post', { summary: 'create' }]]);
    const source = deepFreeze({
      paths: { '/pets': { get: { summary: 'list', responses: {} } } },
    });

    const result = cloneStrip(source, refTargets);

    expect(result.paths).toEqual({
      '/pets': { get: { summary: 'list', responses: {} }, post: { summary: 'create' } },
    });
  });

  it('copies a target once however many $refs point at it', () => {
    const defs: Record<string, unknown> = { d20: { type: 'string' } };
    for (let level = 19; level >= 0; level--) {
      defs[`d${level}`] = {
        type: 'object',
        properties: {
          a: { $ref: `#/x-defs/d${level + 1}`, description: 'left' },
          b: { $ref: `#/x-defs/d${level + 1}`, description: 'right' },
        },
      };
    }
    const refTargets = new Map(
      Object.entries(defs).map(([name, def]) => [
        `#/x-defs/${name}`,
        def as Record<string, unknown>,
      ]),
    );
    const source = deepFreeze({ schema: { $ref: '#/x-defs/d0' } });

    const result = cloneStrip(source, refTargets);

    expect(result['x-defs']).toEqual(defs);
    expect(JSON.stringify(result).length).toBeLessThan(5_000);
  });

  it('leaves a recursive $ref as a pointer into the copied target', () => {
    const node = { type: 'object', properties: { child: { $ref: '#/x-shared/Node' } } };
    const refTargets = new Map([['#/x-shared/Node', deepFreeze(node)]]);
    const source = deepFreeze({ schema: { $ref: '#/x-shared/Node' } });

    expect(cloneStrip(source, refTargets)).toEqual({
      schema: { $ref: '#/x-shared/Node' },
      'x-shared': { Node: node },
    });
  });

  it('ignores a target whose address passes through __proto__', () => {
    const refTargets = new Map([['#/__proto__/polluted', { type: 'string' }]]);
    const source = deepFreeze({ schema: { $ref: '#/__proto__/polluted' } });

    const result = cloneStrip(source, refTargets);

    expect(result).toEqual({ schema: { $ref: '#/__proto__/polluted' } });
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('copies a target under an x-default-prefixed extension that is not a credential key', () => {
    const refTargets = new Map([['#/x-default-parameters/Page', { name: 'page', in: 'query' }]]);
    const source = deepFreeze({ parameters: [{ $ref: '#/x-default-parameters/Page' }] });

    expect(cloneStrip(source, refTargets)).toEqual({
      parameters: [{ $ref: '#/x-default-parameters/Page' }],
      'x-default-parameters': { Page: { name: 'page', in: 'query' } },
    });
  });

  it('ignores a target whose address passes through a stripped key', () => {
    const refTargets = new Map([['#/x-serverValues/creds', { token: 'secret' }]]);
    const source = deepFreeze({ schema: { $ref: '#/x-serverValues/creds' } });

    const result = cloneStrip(source, refTargets);

    expect(result).toEqual({ schema: { $ref: '#/x-serverValues/creds' } });
    expect(JSON.stringify(result)).not.toContain('secret');
  });

  it('throws on a circular object graph', () => {
    const node: Record<string, unknown> = { name: 'root' };
    node.child = { parent: node };

    expect(() => cloneStrip(node, noRefTargets)).toThrow(/circular object graph/);
  });

  it('throws on a cycle that passes through an array', () => {
    const root: Record<string, unknown> = { name: 'root' };
    root.items = [root];

    expect(() => cloneStrip(root, noRefTargets)).toThrow(/circular object graph/);
  });

  it('does not throw when the same object appears twice as siblings', () => {
    const shared = deepFreeze({ type: 'string' });
    const source = deepFreeze({ first: shared, second: shared, list: [shared, shared] });

    const result = cloneStrip(source, noRefTargets);

    expect(result).toEqual({
      first: { type: 'string' },
      second: { type: 'string' },
      list: [{ type: 'string' }, { type: 'string' }],
    });
    expect(expectDefined(result.first)).not.toBe(shared);
    expect(result.first).not.toBe(result.second);
  });
});
