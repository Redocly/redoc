import { describe, expect, it } from 'vitest';

import { formUrlEncodeValue } from '../form-urlencoded.js';

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

  it('applies the form style with explode=false from encoding', () => {
    expect(formUrlEncodeValue({ tags: ['red', 'green'] }, { tags: { explode: false } })).toBe(
      'tags=red,green',
    );
  });

  it('applies the deepObject style from encoding', () => {
    expect(
      formUrlEncodeValue({ filter: { status: 'active' } }, { filter: { style: 'deepObject' } }),
    ).toBe('filter[status]=active');
  });

  it('leaves fields without an encoding entry on the default serialization', () => {
    expect(formUrlEncodeValue({ a: ['x', 'y'], b: 'plain' }, { b: { explode: false } })).toBe(
      `a=${encodeURIComponent('["x","y"]')}&b=plain`,
    );
  });
});
