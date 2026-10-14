import { describe, expect, it } from 'vitest';
import * as Sampler from 'openapi-sampler';

import { jsonToCsv } from '../csv.js';

const category = (competitor: string, first: string, second: string) => ({
  type: 'object',
  properties: {
    Competitor: { type: 'string', example: competitor },
    '2023-02-02': { type: 'string', example: first },
    '2023-02-03': { type: 'string', example: second },
  },
});

const schemas = {
  test: {
    type: 'array',
    items: {
      allOf: [
        { $ref: '#/components/schemas/Category1' },
        { $ref: '#/components/schemas/Category2' },
      ],
    },
  },
  test2: {
    type: 'array',
    items: {
      oneOf: [
        { $ref: '#/components/schemas/Category1' },
        { $ref: '#/components/schemas/Category2' },
      ],
    },
  },
  test3: { $ref: '#/components/schemas/Category1' },
  Category1: category('google.com', '0.356263', '0.1251661'),
  Category2: category('facebook.com', '0.74324', '0.73542'),
};

const spec = {
  openapi: '3.0.0',
  info: { title: 'Foo', version: '1.0' },
  paths: {},
  components: { schemas },
};

function sample(schema: Record<string, unknown>): unknown {
  return Sampler.sample(schema, { quiet: true }, spec);
}

describe('jsonToCsv', () => {
  it('writes a header row and one row per record for an array of flat objects', () => {
    const csv = jsonToCsv([
      { Competitor: 'google.com', '2023-02-02': 0.356263, '2023-02-03': 0.1251661 },
      { Competitor: 'facebook.com', '2023-02-02': 0.74324, '2023-02-03': 0.73542 },
    ]);

    expect(csv).toBe(
      [
        'Competitor,2023-02-02,2023-02-03',
        'google.com,0.356263,0.1251661',
        'facebook.com,0.74324,0.73542',
      ].join('\n'),
    );
  });

  it('treats a single flat object as a one-row table', () => {
    expect(jsonToCsv({ id: 1, name: 'Guru', active: true })).toBe('id,name,active\n1,Guru,true');
  });

  it('builds the header from every record and leaves missing cells empty', () => {
    expect(jsonToCsv([{ a: 1 }, { b: 2 }, { a: 3, c: 4 }])).toBe('a,b,c\n1,,\n,2,\n3,,4');
  });

  it('renders null and undefined values as empty cells', () => {
    expect(jsonToCsv([{ a: null, b: undefined, c: 0, d: false }])).toBe('a,b,c,d\n,,0,false');
  });

  it('quotes cells containing commas, quotes or line breaks (RFC 4180)', () => {
    expect(
      jsonToCsv([{ keyword: 'shoes, red', quote: 'say "hi"', multi: 'line1\nline2', cr: 'a\rb' }]),
    ).toBe('keyword,quote,multi,cr\n"shoes, red","say ""hi""","line1\nline2","a\rb"');
  });

  it('leaves a cell empty when a row lacks a column named like an Object.prototype member', () => {
    expect(jsonToCsv([{ constructor: 'Ferrari', driver: 'a' }, { driver: 'b' }])).toBe(
      'constructor,driver\nFerrari,a\n,b',
    );
    expect(jsonToCsv([{ toString: 'x' }, { a: 1 }])).toBe('toString,a\nx,\n,1');
  });

  it('treats an own __proto__ key as an ordinary column', () => {
    const rows = JSON.parse('[{"__proto__":"x","a":1},{"a":2}]');

    expect(jsonToCsv(rows)).toBe('__proto__,a\nx,1\n,2');
    expect(Object.getPrototypeOf(rows[1])).toBe(Object.prototype);
  });

  it('writes an empty single-column cell as "" so the row is not a blank line', () => {
    expect(jsonToCsv([{ a: 'x' }, { a: '' }, { a: null }])).toBe('a\nx\n""\n""');
  });

  it('quotes header names that need it', () => {
    expect(jsonToCsv([{ 'last, first': 'Smith, John' }])).toBe('"last, first"\n"Smith, John"');
  });

  it.each([
    ['an empty array', []],
    ['an empty object', {}],
    ['a primitive', 'string'],
    ['null', null],
    ['an array of primitives', ['a', 'b']],
    ['an array mixing objects and primitives', [{ a: 1 }, 'b']],
    ['a record with a nested object', { prop: {} }],
    ['a record with a nested array', { prop: [] }],
    ['a later record with a nested value', [{ a: 1 }, { a: { b: 2 } }]],
  ])('returns undefined for %s', (_label, value) => {
    expect(jsonToCsv(value)).toBeUndefined();
  });

  // These mirror the fixtures of the original pull request (Redocly/redoc#2347). The expected
  // rows come from openapi-sampler: for allOf the last schema's example wins.
  describe('with samples generated from a schema', () => {
    it('serializes an array of items using allOf', () => {
      expect(jsonToCsv(sample(schemas.test))).toBe(
        'Competitor,2023-02-02,2023-02-03\nfacebook.com,0.74324,0.73542',
      );
    });

    it('serializes each oneOf variant of an array of items', () => {
      const variants = schemas.test2.items.oneOf.map((variant) =>
        jsonToCsv(sample({ type: 'array', items: variant })),
      );

      expect(variants).toEqual([
        'Competitor,2023-02-02,2023-02-03\ngoogle.com,0.356263,0.1251661',
        'Competitor,2023-02-02,2023-02-03\nfacebook.com,0.74324,0.73542',
      ]);
    });

    it('serializes a $ref to a flat object', () => {
      expect(jsonToCsv(sample(schemas.test3))).toBe(
        'Competitor,2023-02-02,2023-02-03\ngoogle.com,0.356263,0.1251661',
      );
    });
  });
});
