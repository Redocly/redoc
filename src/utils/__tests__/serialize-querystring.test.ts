import { describe, expect, it } from 'vitest';

import { objectToHarParams } from '../serialize-querystring.js';

describe('objectToHarParams', () => {
  it('flattens primitives into name=value pairs', () => {
    expect(objectToHarParams({ name: 'test', age: 23 })).toEqual([
      { name: 'name', value: 'test' },
      { name: 'age', value: '23' },
    ]);
  });

  it('flattens nested objects with bracket notation', () => {
    expect(
      objectToHarParams({
        address: { city: 'Test', zip: '80-001' },
      }),
    ).toEqual([
      { name: 'address[city]', value: 'Test' },
      { name: 'address[zip]', value: '80-001' },
    ]);
  });

  it('repeats key for arrays of strings', () => {
    expect(objectToHarParams({ tags: ['admin', 'editor'] })).toEqual([
      { name: 'tags', value: 'admin' },
      { name: 'tags', value: 'editor' },
    ]);
  });

  it('repeats key for arrays of numbers and booleans', () => {
    expect(objectToHarParams({ ids: [1, 2], flags: [true, false] })).toEqual([
      { name: 'ids', value: '1' },
      { name: 'ids', value: '2' },
      { name: 'flags', value: 'true' },
      { name: 'flags', value: 'false' },
    ]);
  });

  it('matches openapi-docs reference output for deeply nested mixed payloads', () => {
    const value = {
      name: 'test',
      age: 23,
      tags: ['admin', 'editor'],
      address: { city: 'Test', zip: '80-001' },
      preferences: {
        notifications: true,
        categories: ['tech', 'science'],
      },
    };

    expect(objectToHarParams(value)).toEqual([
      { name: 'name', value: 'test' },
      { name: 'age', value: '23' },
      { name: 'tags', value: 'admin' },
      { name: 'tags', value: 'editor' },
      { name: 'address[city]', value: 'Test' },
      { name: 'address[zip]', value: '80-001' },
      { name: 'preferences[notifications]', value: 'true' },
      { name: 'preferences[categories]', value: 'tech' },
      { name: 'preferences[categories]', value: 'science' },
    ]);
  });
});
