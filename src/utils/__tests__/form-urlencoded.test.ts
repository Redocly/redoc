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

  it('repeats the name for an array with the form style and the default explode', () => {
    expect(
      formUrlEncodeValue(
        { to: ['alice@example.com', 'bob@example.com'] },
        { to: { style: 'form' } },
      ),
    ).toBe('to=alice%40example.com&to=bob%40example.com');
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

  it('applies the pipeDelimited style from encoding, percent-encoding the delimiter', () => {
    expect(
      formUrlEncodeValue({ tags: ['red', 'green'] }, { tags: { style: 'pipeDelimited' } }),
    ).toBe('tags=red%7Cgreen');
  });

  it('applies the deepObject style from encoding, percent-encoding the brackets', () => {
    expect(
      formUrlEncodeValue({ filter: { status: 'active' } }, { filter: { style: 'deepObject' } }),
    ).toBe('filter%5Bstatus%5D=active');
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

  it('passes percent-encoded triples through when the encoding sets allowReserved', () => {
    const value = { q: 'a%20b 100% %2C' };
    expect(formUrlEncodeValue(value, { q: { allowReserved: true } })).toBe(
      'q=a%20b%20100%25%20%2C',
    );
    expect(formUrlEncodeValue(value, { q: { allowReserved: false } })).toBe(
      'q=a%2520b%20100%25%20%252C',
    );
  });

  it('serializes an XML-typed object as one-line XML under its xml name or the field name', () => {
    expect(
      formUrlEncodeValue(
        { cv: { title: 'CV' }, meta: { year: 2026 } },
        {
          cv: { contentType: 'application/xml', xmlName: 'resume' },
          meta: { contentType: 'application/xml' },
        },
      ),
    ).toBe(
      `cv=${encodeURIComponent('<resume><title>CV</title></resume>')}&meta=${encodeURIComponent('<meta><year>2026</year></meta>')}`,
    );
  });

  it('keeps a JSON-typed string only when it is the JSON text of an object or array', () => {
    const json = { contentType: 'application/json' };
    expect(
      formUrlEncodeValue(
        { settings: '{"a":1}', list: '[1,2]', id: '123', flag: 'true' },
        { settings: json, list: json, id: json, flag: json },
      ),
    ).toBe(
      `settings=${encodeURIComponent('{"a":1}')}&list=${encodeURIComponent('[1,2]')}&id=%22123%22&flag=%22true%22`,
    );
  });

  it('leaves out null values and empty styled values, unless a JSON content type writes null', () => {
    expect(
      formUrlEncodeValue(
        { a: null, tags: [], ids: ['x', null], color: { R: 1, G: null }, json: null, b: 'x' },
        {
          tags: { explode: false },
          ids: { style: 'form', explode: true },
          color: { style: 'form', explode: false },
          json: { contentType: 'application/json' },
        },
      ),
    ).toBe('ids=x&color=R,1&json=null&b=x');
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
