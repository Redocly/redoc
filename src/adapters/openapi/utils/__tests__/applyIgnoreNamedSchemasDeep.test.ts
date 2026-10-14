import { applyIgnoreNamedSchemasDeep } from '../applyIgnoreNamedSchemasDeep';

describe('applyIgnoreNamedSchemasDeep', () => {
  it('replaces nested $ref to an ignored schema name', () => {
    const input = {
      type: 'object',
      properties: {
        ignoredDemo: { $ref: '#/components/schemas/IgnoredDemoSchema' },
        other: { type: 'string' },
      },
    };
    const ignore = new Set(['IgnoredDemoSchema']);
    expect(applyIgnoreNamedSchemasDeep(input, ignore)).toEqual({
      type: 'object',
      properties: {
        ignoredDemo: { type: 'object', title: 'IgnoredDemoSchema' },
        other: { type: 'string' },
      },
    });
  });

  it('is a no-op when ignore set is empty', () => {
    const input = { properties: { x: { $ref: '#/components/schemas/IgnoredDemoSchema' } } };
    expect(applyIgnoreNamedSchemasDeep(input, new Set())).toEqual(input);
  });
});
