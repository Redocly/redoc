import { describe, it, expect } from 'vitest';

import { normalizeMenuConfig } from '../normalizeMenu.js';
import type { ApiDocsOptions } from '../../../../types/options.js';

describe('normalizeMenuConfig', () => {
  it('converts regex string patterns, regex-like objects, and non-standard values', () => {
    const existingRegex = /^User/;
    const config = {
      menu: {
        groups: [
          {
            name: 'Mixed',
            queries: {
              includeByName: [
                'plainString',
                '/^__/i',
                existingRegex,
                { source: '^Admin', flags: 'g' },
                123,
              ],
            },
          },
        ],
      },
    } as ApiDocsOptions;
    const result = normalizeMenuConfig(config.menu);
    const patterns = result?.groups?.[0].queries?.includeByName;

    expect(patterns?.[0]).toBe('plainString');

    expect(patterns?.[1]).toBeInstanceOf(RegExp);
    expect((patterns?.[1] as RegExp | undefined)?.source).toBe('^__');
    expect((patterns?.[1] as RegExp | undefined)?.flags).toBe('i');

    expect(patterns?.[2]).toBe(existingRegex);

    expect(patterns?.[3]).toBeInstanceOf(RegExp);
    expect((patterns?.[3] as RegExp | undefined)?.source).toBe('^Admin');
    expect((patterns?.[3] as RegExp | undefined)?.flags).toBe('g');

    expect(patterns?.[4]).toBe('123');
  });
});
