import { describe, it, expect } from 'vitest';

import { buildGraphqlConfigMetadataRows } from '../configMetadataRows.js';

describe('buildGraphqlConfigMetadataRows', () => {
  it('returns empty array for undefined or non-object', () => {
    expect(buildGraphqlConfigMetadataRows(undefined)).toEqual([]);
    expect(buildGraphqlConfigMetadataRows(null as never)).toEqual([]);
  });

  it('filters out title and description like graphql-docs Overview', () => {
    expect(
      buildGraphqlConfigMetadataRows({
        title: 'T',
        description: 'D',
        apiId: 'x',
      }),
    ).toEqual([{ key: 'apiId', value: 'x' }]);
  });

  it('stringifies scalars and joins primitive array elements', () => {
    expect(
      buildGraphqlConfigMetadataRows({
        n: 1,
        tags: ['a', 'b'],
      }),
    ).toEqual([
      { key: 'n', value: '1' },
      { key: 'tags', value: 'a, b' },
    ]);
  });

  it('drops object entries and nested objects in arrays', () => {
    expect(
      buildGraphqlConfigMetadataRows({
        nested: { a: 1 },
        list: [1, { x: 1 }, 'z'],
      }),
    ).toEqual([{ key: 'list', value: '1, z' }]);
  });
});
