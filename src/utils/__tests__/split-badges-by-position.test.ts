import { describe, expect, it } from 'vitest';

import type { BadgeType } from '../../types/schema.js';

import { splitBadgesByPosition } from '../split-badges-by-position.js';

describe('splitBadgesByPosition', () => {
  it('returns empty arrays when badges are undefined', () => {
    expect(splitBadgesByPosition(undefined)).toEqual({ before: [], after: [] });
  });

  it('splits badges by position and preserves original order within each group', () => {
    const badges: BadgeType[] = [
      { name: 'beta', position: 'after', color: '#888' },
      { name: 'required', position: 'before', color: '#f00' },
      { name: 'deprecated', position: 'after', color: '#999' },
      { name: 'internal', position: 'before', color: '#00f' },
    ];

    const result = splitBadgesByPosition(badges);

    expect(result.before).toEqual([
      { name: 'required', position: 'before', color: '#f00' },
      { name: 'internal', position: 'before', color: '#00f' },
    ]);
    expect(result.after).toEqual([
      { name: 'beta', position: 'after', color: '#888' },
      { name: 'deprecated', position: 'after', color: '#999' },
    ]);
  });
});
