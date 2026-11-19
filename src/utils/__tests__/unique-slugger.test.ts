import { describe, expect, it } from 'vitest';

import { createUniqueSlugger, keepPreviousRoutes } from '../unique-slugger.js';

describe('createUniqueSlugger', () => {
  it('suffixes names that slugify alike, the first one keeping the plain slug', () => {
    const slugger = createUniqueSlugger();

    expect(['Pets', 'pets', 'PETS'].map((name) => slugger(name, '/api'))).toEqual([
      '/api/pets',
      '/api/pets-1',
      '/api/pets-2',
    ]);
  });

  it('skips a suffix that is the plain slug of a known name slugged later', () => {
    const names = ['Pets', 'pets', 'Pets 1'];
    const slugger = createUniqueSlugger(names);

    expect(names.map((name) => slugger(name, '/api'))).toEqual([
      '/api/pets',
      '/api/pets-2',
      '/api/pets-1',
    ]);
    expect([...slugger.moved]).toEqual([['/api/pets-2', '/api/pets']]);
  });

  it('encodes backslashes in slugs', () => {
    const names = ['\\', '\\ '];
    const slugger = createUniqueSlugger(names);

    expect(names.map((name) => slugger(name, '/api'))).toEqual(['/api/%5C', '/api/%5C-1']);
  });

  it('returns the same slug for a repeated name and key', () => {
    const slugger = createUniqueSlugger();

    expect(slugger('Pets', '/api')).toBe(slugger('Pets', '/api'));
  });
});

describe('keepPreviousRoutes', () => {
  it('maps pages under a suffixed slug back to their old route', () => {
    const page: { link: string; previousRouteSlug?: string } = { link: '/api/pets-2/list' };
    const kept = { link: '/api/pets-1/list' };

    keepPreviousRoutes([page, kept], new Map([['/api/pets-2', '/api/pets']]));

    expect(page.previousRouteSlug).toBe('/api/pets/list');
    expect(kept).not.toHaveProperty('previousRouteSlug');
  });
});
