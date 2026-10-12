import { describe, it, expect } from 'vitest';

import {
  registerExample,
  resolveContent,
  resolveRef,
  stableStringify,
  pickRenderableDescription,
} from '../helpers.js';

describe('stableStringify', () => {
  it('returns "null" for null', () => {
    expect(stableStringify(null)).toBe('null');
  });

  it('returns "undefined" for undefined', () => {
    expect(stableStringify(undefined)).toBe('undefined');
  });

  it('serializes strings', () => {
    expect(stableStringify('hello')).toBe('"hello"');
  });

  it('serializes numbers', () => {
    expect(stableStringify(42)).toBe('42');
  });

  it('serializes booleans', () => {
    expect(stableStringify(true)).toBe('true');
    expect(stableStringify(false)).toBe('false');
  });

  it('serializes an empty object', () => {
    expect(stableStringify({})).toBe('{}');
  });

  it('serializes an empty array', () => {
    expect(stableStringify([])).toBe('[]');
  });

  it('serializes a flat array', () => {
    expect(stableStringify([1, 'a', true])).toBe('[1,"a",true]');
  });

  it('sorts object keys alphabetically', () => {
    expect(stableStringify({ z: 1, a: 2, m: 3 })).toBe('{"a":2,"m":3,"z":1}');
  });

  it('produces identical output regardless of key insertion order', () => {
    const a = { b: 1, a: 2 };
    const b = { a: 2, b: 1 };
    expect(stableStringify(a)).toBe(stableStringify(b));
  });

  it('serializes nested objects with sorted keys', () => {
    const data = { b: { d: 1, c: 2 }, a: 3 };
    expect(stableStringify(data)).toBe('{"a":3,"b":{"c":2,"d":1}}');
  });

  it('serializes arrays inside objects', () => {
    const data = { items: [1, 2, 3] };
    expect(stableStringify(data)).toBe('{"items":[1,2,3]}');
  });

  it('serializes objects inside arrays', () => {
    const data = [{ b: 1, a: 2 }];
    expect(stableStringify(data)).toBe('[{"a":2,"b":1}]');
  });

  it('handles circular references in objects', () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    expect(stableStringify(obj)).toBe('{"a":1,"self":"[Circular]"}');
  });

  it('handles circular references in arrays', () => {
    const arr: unknown[] = [1];
    arr.push(arr);
    expect(stableStringify(arr)).toBe('[1,"[Circular]"]');
  });

  it('handles deeply nested circular references', () => {
    const inner: Record<string, unknown> = { x: 10 };
    const outer = { child: inner };
    inner.parent = outer;
    expect(stableStringify(outer)).toBe('{"child":{"parent":"[Circular]","x":10}}');
  });

  it('serializes null values inside objects', () => {
    expect(stableStringify({ a: null })).toBe('{"a":null}');
  });

  it('serializes undefined values inside objects', () => {
    expect(stableStringify({ a: undefined })).toBe('{"a":undefined}');
  });

  it('serializes mixed nested structures', () => {
    const data = { z: [{ b: 2, a: 1 }, null, 'str'], a: true };
    expect(stableStringify(data)).toBe('{"a":true,"z":[{"a":1,"b":2},null,"str"]}');
  });
});


describe('resolveRef ignoreNamedSchemas', () => {
  const spec: Record<string, unknown> = {
    components: {
      schemas: {
        IgnoredDemoSchema: {
          type: 'string',
          example: 'should-not-appear',
        },
      },
    },
  };

  it('returns placeholder object when schema name is ignored', () => {
    const ignore = new Set(['IgnoredDemoSchema']);
    const result = resolveRef(spec, { $ref: '#/components/schemas/IgnoredDemoSchema' }, ignore);
    expect(result).toEqual({ type: 'object', title: 'IgnoredDemoSchema' });
  });

  it('resolves full schema when name is not ignored', () => {
    const result = resolveRef(spec, { $ref: '#/components/schemas/IgnoredDemoSchema' }, new Set());
    expect(result).toEqual({ type: 'string', example: 'should-not-appear' });
  });
});

describe('resolveContent', () => {
  const mediaTypes = {
    PatchResponse: {
      schema: { type: 'object', properties: { id: { type: 'string' } } },
      examples: {
        default: { value: { id: '123' } },
      },
    },
  };
  const spec: Record<string, unknown> = {
    components: {
      mediaTypes: {
        ...mediaTypes,
        PatchResponseAlias: { $ref: '#/components/mediaTypes/PatchResponse' },
        LoopA: { $ref: '#/components/mediaTypes/LoopB' },
        LoopB: { $ref: '#/components/mediaTypes/LoopA' },
      },
    },
  };

  it('returns the inline content map unchanged', () => {
    const inline = {
      'application/json': { schema: { type: 'string' } },
    };
    const result = resolveContent(spec, { content: inline });
    expect(result).toEqual(inline);
  });

  it('dereferences a media type entry that references components/mediaTypes (OpenAPI 3.2)', () => {
    const result = resolveContent(spec, {
      content: {
        'application/json': { $ref: '#/components/mediaTypes/PatchResponse' },
        'text/plain': { schema: { type: 'string' } },
      },
    });
    expect(result).toEqual({
      'application/json': mediaTypes.PatchResponse,
      'text/plain': { schema: { type: 'string' } },
    });
  });

  it('resolves a content map that is itself a $ref', () => {
    const result = resolveContent(
      { ...spec, 'x-content': { 'application/json': mediaTypes.PatchResponse } },
      { content: { $ref: '#/x-content' } as never },
    );
    expect(result).toEqual({ 'application/json': mediaTypes.PatchResponse });
  });

  it('follows a media type that references another media type', () => {
    const result = resolveContent(spec, {
      content: { 'application/json': { $ref: '#/components/mediaTypes/PatchResponseAlias' } },
    });
    expect(result).toEqual({ 'application/json': mediaTypes.PatchResponse });
  });

  it('drops a media type entry whose $ref cannot be resolved or is cyclic', () => {
    const result = resolveContent(spec, {
      content: {
        'application/json': { $ref: '#/components/mediaTypes/Missing' },
        'application/xml': { $ref: '#/components/mediaTypes/LoopA' },
        'text/plain': { schema: { type: 'string' } },
      },
    });
    expect(result).toEqual({ 'text/plain': { schema: { type: 'string' } } });
  });

  it('returns undefined when no media type is left', () => {
    expect(
      resolveContent(spec, {
        content: { 'application/json': { $ref: '#/components/mediaTypes/Missing' } },
      }),
    ).toBeUndefined();
    expect(resolveContent(spec, { content: {} })).toBeUndefined();
  });

  it('returns undefined when content is missing', () => {
    expect(resolveContent(spec, {})).toBeUndefined();
    expect(resolveContent(spec, undefined)).toBeUndefined();
  });
});

describe('pickRenderableDescription', () => {
  it('passes raw markdown strings through, including html, markdoc tags, and special symbols', () => {
    const cases = [
      'This is a **fictional** win.',
      'Has <b>raw html</b> and <img src=x onerror="alert(1)">',
      'Before {% admonition type="info" %}inside{% /admonition %} after',
      'ok',
      `Symbols: < > & " ' \` ~ € 100% #tag @user $var ; -- () [] {}`,
      'Uses {{API_URL}} and {$request.body#/id} placeholders',
      '',
    ];
    for (const value of cases) {
      expect(pickRenderableDescription(value)).toBe(value);
    }
  });

  it('passes pre-parsed AST nodes through (a host may replace markdown strings with parsed markdoc)', () => {
    const node = { $$mdtype: 'Node', type: 'paragraph', attributes: {}, children: [] };
    expect(pickRenderableDescription(node)).toBe(node);
    expect(pickRenderableDescription([node])).toEqual([node]);
  });

  it('drops non-string, non-object values', () => {
    expect(pickRenderableDescription(42)).toBeUndefined();
    expect(pickRenderableDescription(true)).toBeUndefined();
    expect(pickRenderableDescription(null)).toBeUndefined();
    expect(pickRenderableDescription(undefined)).toBeUndefined();
  });
});

describe('registerExample fallback ids', () => {
  it('numbers each store from example_0', () => {
    const a = {};
    const b = {};
    expect(registerExample(a, { value: 1 })).toBe('example_0');
    expect(registerExample(a, { value: 2 })).toBe('example_1');
    expect(registerExample(b, { value: 3 })).toBe('example_0');
  });

  it('skips ids a hydrated store already holds and stores the new entry', () => {
    const store = {
      example_0: { id: 'example_0', value: 'built' },
      example_1: { id: 'example_1', value: 'built' },
    };
    const id = registerExample(store, { value: 'runtime' });
    expect(id).toBe('example_2');
    expect(store[id]?.value).toBe('runtime');
    expect(store.example_0.value).toBe('built');
  });
});
