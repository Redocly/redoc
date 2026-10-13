import { describe, expect, it } from 'vitest';

import { pickFormFieldEncoding, pickStoredFormEncoding } from '../form-encoding.js';

describe('pickFormFieldEncoding', () => {
  it('keeps style, explode, allowReserved and contentType per field', () => {
    expect(
      pickFormFieldEncoding('multipart/form-data', {
        to: { style: 'form', explode: true },
        meta: { contentType: 'application/json', allowReserved: true },
      }),
    ).toEqual({
      to: { style: 'form', explode: true },
      meta: { contentType: 'application/json', allowReserved: true },
    });
  });

  it('drops part headers for urlencoded bodies and entries without a serialization field', () => {
    expect(
      pickFormFieldEncoding('application/x-www-form-urlencoded', {
        file: { headers: { 'X-Rate-Limit': { schema: { type: 'integer' } } } },
        tags: { explode: false },
      }),
    ).toEqual({ tags: { explode: false } });
  });

  it('reduces multipart part headers to one sample value each, resolving references', () => {
    const doc = {
      components: {
        headers: { Checksum: { schema: { type: 'string', example: 'sha256' } } },
      },
    };
    expect(
      pickFormFieldEncoding(
        'multipart/form-data',
        {
          file: {
            headers: {
              'X-Checksum': { $ref: '#/components/headers/Checksum' },
              'X-Retries': { schema: { type: 'integer' } },
              'X-Mode': { schema: { type: 'string', enum: ['fast', 'slow'] } },
              'Content-Type': { schema: { type: 'string' } },
              'Content-Disposition': { schema: { type: 'string' } },
            },
          },
        },
        doc,
      ),
    ).toEqual({
      file: { headers: { 'X-Checksum': 'sha256', 'X-Retries': '0', 'X-Mode': 'fast' } },
    });
  });

  it('keeps every part header sample on one line', () => {
    expect(
      pickFormFieldEncoding('multipart/form-data', {
        file: {
          headers: {
            'X-Signature': { schema: { type: 'string', example: 'sha256=abc\n' } },
            'X-Note': { example: 'a\r\nInjected: 1' },
          },
        },
      }),
    ).toEqual({ file: { headers: { 'X-Signature': 'sha256=abc', 'X-Note': 'a Injected: 1' } } });
  });

  it('adds the xml name of an XML-typed urlencoded field through $ref, allOf and array items', () => {
    const doc = {
      components: {
        schemas: {
          Resume: { type: 'object', xml: { name: 'resume' } },
          Tag: { type: 'object', xml: { name: 'tag' } },
        },
      },
    };
    const schema = {
      allOf: [
        { properties: { cv: { $ref: '#/components/schemas/Resume' } } },
        {
          properties: {
            tags: { type: 'array', items: { $ref: '#/components/schemas/Tag' } },
            plain: { type: 'object' },
          },
        },
      ],
    };
    const encoding = {
      cv: { contentType: 'application/xml' },
      tags: { contentType: 'text/xml' },
      plain: { contentType: 'application/xml' },
    };

    expect(
      pickFormFieldEncoding('application/x-www-form-urlencoded', encoding, doc, schema),
    ).toEqual({
      cv: { contentType: 'application/xml', xmlName: 'resume' },
      tags: { contentType: 'text/xml', xmlName: 'tag' },
      plain: { contentType: 'application/xml' },
    });
    expect(pickFormFieldEncoding('multipart/form-data', encoding, doc, schema)).toEqual(encoding);
  });

  it('stores the encoding of urlencoded media types only, with xml names', () => {
    const media = {
      schema: { type: 'object', properties: { cv: { type: 'object', xml: { name: 'resume' } } } },
      encoding: { cv: { contentType: 'application/xml' } },
    };

    expect(pickStoredFormEncoding('application/x-www-form-urlencoded', media, {})).toEqual({
      cv: { contentType: 'application/xml', xmlName: 'resume' },
    });
    expect(pickStoredFormEncoding('multipart/form-data', media, {})).toBeUndefined();
  });

  it('returns undefined for a non-form media type or when nothing survives', () => {
    expect(
      pickFormFieldEncoding('application/json', { tags: { style: 'form', explode: false } }),
    ).toBeUndefined();
    expect(pickFormFieldEncoding('multipart/form-data', undefined)).toBeUndefined();
    expect(pickFormFieldEncoding('multipart/form-data', { file: {} })).toBeUndefined();
  });
});
