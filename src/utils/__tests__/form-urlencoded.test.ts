import { describe, expect, it } from 'vitest';

import { formUrlEncodeValue, pickFormEncoding } from '../form-urlencoded.js';

describe('formUrlEncodeValue', () => {
  it('encodes a flat object with RFC 3986 percent-encoding (spaces become %20)', () => {
    expect(
      formUrlEncodeValue({
        name: 'Museum Visitor',
        value: 'premium',
        count: 5,
        enabled: true,
      }),
    ).toBe('name=Museum%20Visitor&value=premium&count=5&enabled=true');
  });

  it('returns string values unchanged', () => {
    expect(formUrlEncodeValue('name=Bob&value=basic')).toBe('name=Bob&value=basic');
  });

  it('serializes nested object values via JSON.stringify', () => {
    expect(formUrlEncodeValue({ filter: { type: 'admin' } })).toBe(
      `filter=${encodeURIComponent('{"type":"admin"}')}`,
    );
  });

  it('repeats the field name for each array item when the field has no encoding', () => {
    expect(formUrlEncodeValue({ tags: ['red', 'green'] })).toBe('tags=red&tags=green');
  });

  it('serializes each object item of an array as JSON under the repeated field name', () => {
    expect(formUrlEncodeValue({ items: [{ id: 1 }, { id: 2 }] })).toBe(
      `items=${encodeURIComponent('{"id":1}')}&items=${encodeURIComponent('{"id":2}')}`,
    );
  });

  it('omits a field whose array is empty', () => {
    expect(formUrlEncodeValue({ tags: [], name: 'x' })).toBe('name=x');
  });

  it('serializes a primitive as JSON when its encoding contentType is application/json', () => {
    expect(formUrlEncodeValue({ id: 'abc' }, { id: { contentType: 'application/json' } })).toBe(
      'id=%22abc%22',
    );
  });

  it('keeps content-based serialization when the encoding sets only contentType', () => {
    expect(
      formUrlEncodeValue(
        { address: { city: 'Kyiv' } },
        { address: { contentType: 'application/json' } },
      ),
    ).toBe(`address=${encodeURIComponent('{"city":"Kyiv"}')}`);
  });

  it('applies the form style with explode=false from encoding', () => {
    expect(formUrlEncodeValue({ tags: ['red', 'green'] }, { tags: { explode: false } })).toBe(
      'tags=red,green',
    );
  });

  it('applies the spaceDelimited style from encoding', () => {
    expect(
      formUrlEncodeValue({ tags: ['red', 'green'] }, { tags: { style: 'spaceDelimited' } }),
    ).toBe('tags=red%20green');
  });

  it('applies the pipeDelimited style from encoding', () => {
    expect(
      formUrlEncodeValue({ tags: ['red', 'green'] }, { tags: { style: 'pipeDelimited' } }),
    ).toBe('tags=red|green');
  });

  it('applies the deepObject style from encoding', () => {
    expect(
      formUrlEncodeValue({ filter: { status: 'active' } }, { filter: { style: 'deepObject' } }),
    ).toBe('filter[status]=active');
  });

  it('spreads object properties into top-level fields for form style with explode=true', () => {
    expect(
      formUrlEncodeValue(
        { address: { city: 'Kyiv', zip: '01001' } },
        { address: { style: 'form', explode: true } },
      ),
    ).toBe('city=Kyiv&zip=01001');
  });

  it('switches to style-based serialization when the encoding sets only allowReserved', () => {
    expect(
      formUrlEncodeValue({ address: { city: 'Kyiv' } }, { address: { allowReserved: true } }),
    ).toBe('city=Kyiv');
  });

  it('leaves fields without an encoding entry on the default serialization', () => {
    expect(formUrlEncodeValue({ a: ['x', 'y'], b: 'plain' }, { b: { explode: false } })).toBe(
      'a=x&a=y&b=plain',
    );
  });

  it('keeps reserved characters unescaped when the encoding sets allowReserved', () => {
    const value = { url: 'https://x.io/a?b=c&d' };
    expect(formUrlEncodeValue(value, { url: { allowReserved: true } })).toBe(
      'url=https://x.io/a?b%3Dc%26d',
    );
    expect(formUrlEncodeValue(value, { url: { allowReserved: false } })).toBe(
      'url=https%3A%2F%2Fx.io%2Fa%3Fb%3Dc%26d',
    );
  });

  it('sends an empty value for an undefined field with a JSON contentType', () => {
    expect(
      formUrlEncodeValue({ meta: undefined }, { meta: { contentType: 'application/json' } }),
    ).toBe('meta=');
  });
});

describe('pickFormEncoding', () => {
  it('keeps only the members that drive serialization', () => {
    const encoding = {
      tags: { style: 'form', explode: false, headers: { 'X-Rate-Limit': { schema: {} } } },
      meta: { contentType: 'application/json', allowReserved: true },
    };
    expect(pickFormEncoding(encoding)).toEqual({
      tags: { style: 'form', explode: false },
      meta: { contentType: 'application/json', allowReserved: true },
    });
  });

  it('treats an empty encoding entry as no encoding', () => {
    expect(pickFormEncoding({ tags: null })).toEqual({ tags: {} });
  });

  it('returns undefined without an encoding object', () => {
    expect(pickFormEncoding(undefined)).toBeUndefined();
  });
});
