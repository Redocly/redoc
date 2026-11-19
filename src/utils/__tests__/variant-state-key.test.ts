import { describe, expect, it } from 'vitest';

import { buildVariantStateKey } from '../variant-state-key.js';

describe('buildVariantStateKey', () => {
  it('returns the localPart unchanged for a root axis (undefined parents)', () => {
    expect(buildVariantStateKey(undefined, 'One of:')).toBe('One of:');
  });

  it('returns the localPart unchanged for a root axis (empty parents)', () => {
    expect(buildVariantStateKey([], 'itemType')).toBe('itemType');
  });

  it('joins a single-segment parent path with /', () => {
    expect(buildVariantStateKey(['entityMetadata'], 'One of:')).toBe('entityMetadata/One of:');
  });

  it('joins a multi-segment parent path with /', () => {
    expect(buildVariantStateKey(['payment', 'method'], 'kind')).toBe('payment/method/kind');
  });

  it('preserves array-item suffix on the last segment', () => {
    expect(buildVariantStateKey(['tripFilters[]'], 'filterType')).toBe('tripFilters[]/filterType');
  });

  it('does not mutate the input array', () => {
    const path = ['a', 'b'];
    buildVariantStateKey(path, 'kind');
    expect(path).toEqual(['a', 'b']);
  });
});
