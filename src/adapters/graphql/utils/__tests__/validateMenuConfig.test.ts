import { describe, it, expect } from 'vitest';
import { buildSchema } from 'graphql';

import { validateGraphqlMenuConfig } from '../validateMenuConfig.js';

const SCHEMA = buildSchema(`
  type Query { query1: String, query2: String }
  type Mutation { mutation1: String }
  type Subscription { sub1: String }
  directive @myDirective on FIELD
  type MyObject { id: ID }
`);

describe('validateGraphqlMenuConfig', () => {
  it('rejects "/" in group name', () => {
    expect(() =>
      validateGraphqlMenuConfig(SCHEMA, {
        groups: [{ name: 'bad/name', queries: { includeByName: ['query1'] } }],
      }),
    ).toThrow(/not allowed in group names/);
  });

  it.each([
    ['queries', 'Query'],
    ['mutations', 'Mutation'],
    ['subscriptions', 'Subscription'],
    ['directives', 'Directive'],
    ['types', 'Type'],
    ['items', 'Item'],
  ] as const)('rejects unknown plain name in `%s` filter', (key, label) => {
    expect(() =>
      validateGraphqlMenuConfig(SCHEMA, {
        groups: [{ name: 'G', [key]: { includeByName: ['noSuchThing'] } }],
      }),
    ).toThrow(new RegExp(`${label} noSuchThing does not exist`));
  });

  it('does not validate regex string patterns', () => {
    expect(() =>
      validateGraphqlMenuConfig(SCHEMA, {
        groups: [{ name: 'G', queries: { includeByName: ['/does-not-match-anything/'] } }],
      }),
    ).not.toThrow();
  });

  it('treats `u` and `y` flags like normalizeMenu', () => {
    expect(() =>
      validateGraphqlMenuConfig(SCHEMA, {
        groups: [
          {
            name: 'G',
            queries: { includeByName: ['/foo/u', '/bar/y', '/baz/uy'] },
          },
        ],
      }),
    ).not.toThrow();
  });

  it('accepts valid menu config', () => {
    expect(() =>
      validateGraphqlMenuConfig(SCHEMA, {
        groups: [{ name: 'OK', queries: { includeByName: ['query1', 'query2'] } }],
      }),
    ).not.toThrow();
  });
});
