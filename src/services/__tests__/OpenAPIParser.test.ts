import { convertObj } from 'swagger2openapi';
import { OpenAPIParser, RedocNormalizedOptions } from '../';

const options = new RedocNormalizedOptions({});
describe('OpenAPIParser mergeAllOf', async () => {
  const parser = new OpenAPIParser(
    { openapi: '3.0', info: { title: 'test', version: '0' }, paths: {} },
    undefined,
    options,
  );

  it('merge readOnly from allOf', () => {
    expect(parser.mergeAllOf({
      allOf: [
        {
          properties: {
            id: { type: 'string', readOnly: true },
            name: { type: 'string' },
          },
        },
        { properties: { name: { type: 'string', readOnly: true } } },
      ],
    }, '', false).properties).toEqual({
      id: {
        type: 'string',
        readOnly: true,
      },
      name: {
        type: 'string',
        allOf: undefined,
        parentRefs: [],
        readOnly: true,
      },
    });
  });

  it('merge writeOnly from allOf', () => {
    expect(parser.mergeAllOf({
      allOf: [
        {
          properties: {
            id: { type: 'string', readOnly: true },
            name: { type: 'string' },
          },
        },
        { properties: { name: { type: 'string', writeOnly: true } } },
      ],
    }, '', false).properties).toEqual({
      id: {
        type: 'string',
        readOnly: true,
      },
      name: {
        type: 'string',
        allOf: undefined,
        parentRefs: [],
        writeOnly: true,
      },
    });
  });

  it('reset readOnly before merge', () => {
    expect(parser.mergeAllOf({
      allOf: [
        {
          properties: {
            id: { type: 'string', readOnly: true },
            name: { type: 'string' },
          },
        },
        { properties: { id: { type: 'string', readOnly: true } } },
        { properties: { id: { type: 'string' } } },
      ],
    }, '', false).properties).toEqual({
      id: {
        allOf: undefined,
        parentRefs: [],
        type: 'string',
      },
      name: {
        type: 'string',
      },
    });
  });

  it('reset writeOnly before merge', () => {
    expect(parser.mergeAllOf({
      allOf: [
        {
          properties: {
            id: { type: 'string', readOnly: true },
            name: { type: 'string' },
          },
        },
        { properties: { id: { type: 'string', writeOnly: true } } },
        { properties: { id: { type: 'string' } } },
      ],
    }, '', false).properties).toEqual({
      id: {
        allOf: undefined,
        parentRefs: [],
        type: 'string',
      },
      name: {
        type: 'string',
      },
    });
  });
});
