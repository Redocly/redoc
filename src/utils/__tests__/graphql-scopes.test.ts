import { describe, it, expect } from 'vitest';

import { mergeRequiresScopes } from '../graphql-scopes.js';

describe('mergeRequiresScopes', () => {
  it('returns null when neither side has scopes', () => {
    expect(mergeRequiresScopes(undefined, undefined)).toBeNull();
    expect(mergeRequiresScopes(null, null)).toBeNull();
  });

  it('returns only own scopes when the parent has none', () => {
    expect(mergeRequiresScopes({ scopes: [['read:user']] }, undefined)).toEqual({
      scopes: [['read:user']],
    });
  });

  it('returns empty own scopes with parent scopes when only the parent has them', () => {
    expect(mergeRequiresScopes(undefined, { scopes: [['admin']] })).toEqual({
      scopes: [],
      parentScopes: [['admin']],
    });
  });

  it('merges both sides when both carry scopes', () => {
    expect(
      mergeRequiresScopes({ scopes: [['read:user']] }, { scopes: [['admin'], ['ops']] }),
    ).toEqual({
      scopes: [['read:user']],
      parentScopes: [['admin'], ['ops']],
    });
  });
});
