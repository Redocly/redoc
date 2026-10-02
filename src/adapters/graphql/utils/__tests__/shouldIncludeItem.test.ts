import { describe, it, expect } from 'vitest';

import { shouldIncludeItem } from '../shouldIncludeItem.js';

describe('shouldIncludeItem', () => {
  it('matches shared `items` when the section-specific filter is absent', () => {
    expect(shouldIncludeItem('getUser', undefined, { includeByName: ['getUser'] })).toBe(true);
    expect(shouldIncludeItem('other', undefined, { includeByName: ['getUser'] })).toBe(false);
  });

  it('combines specific and common includes and excludes like graphql-docs', () => {
    expect(shouldIncludeItem('x', { includeByName: ['x'] }, { includeByName: ['y'] })).toBe(true);
    expect(shouldIncludeItem('y', { includeByName: ['x'] }, { includeByName: ['y'] })).toBe(true);
    expect(shouldIncludeItem('z', { includeByName: ['x'] }, { includeByName: ['y'] })).toBe(false);
  });

  it('applies exclusions from either specific or common', () => {
    expect(
      shouldIncludeItem('User', { includeByName: ['User'] }, { excludeByName: ['User'] }),
    ).toBe(false);
  });

  it('matches nothing when a group declares only `excludeByName` with no includes', () => {
    expect(shouldIncludeItem('Author', { excludeByName: ['Book'] }, undefined)).toBe(false);
    expect(shouldIncludeItem('Book', { excludeByName: ['Book'] }, undefined)).toBe(false);
    expect(shouldIncludeItem('Author', undefined, { excludeByName: ['Book'] })).toBe(false);
    expect(
      shouldIncludeItem('Author', { excludeByName: ['Book'] }, { excludeByName: ['User'] }),
    ).toBe(false);
  });

  it('matches nothing when both filters are empty objects', () => {
    expect(shouldIncludeItem('Author', {}, undefined)).toBe(false);
    expect(shouldIncludeItem('Author', {}, {})).toBe(false);
  });
});
