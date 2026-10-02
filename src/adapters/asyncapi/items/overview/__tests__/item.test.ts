import { describe, it, expect, vi } from 'vitest';

import type { AsyncApiDefinition } from '../../../../../types/asyncapi.js';

import { buildOverviewContent } from '../content.js';
import { buildOverviewItem } from '../item.js';
import { normalizeOptions } from '../../../../../options/normalizeOptions.js';

vi.mock('../content.js', () => ({
  buildOverviewContent: vi.fn(() => ({ contentType: 'overview', children: [] })),
}));

const info = { title: 'My API', version: '1.0.0' };
const document: AsyncApiDefinition = { asyncapi: '2.6.0', info };
const options = normalizeOptions({
  specType: 'asyncapi' as const,
  metadata: {},
  downloadUrls: [],
  protocol: 'kafka',
  basePath: '',
});

describe('buildOverviewItem', () => {
  it('calls buildOverviewContent and returns an item with the correct link', () => {
    const item = buildOverviewItem(info, {
      basePath: '/api',
      document,
      options,
      protocol: null,
      sectionChildren: [],
    });

    expect(vi.mocked(buildOverviewContent)).toHaveBeenCalledOnce();
    expect(vi.mocked(buildOverviewContent).mock.calls[0][0]).toMatchObject({
      basePath: '/api',
    });
    expect(item.type).toBe('link');
    expect(item.link).toBe('/api');
    expect(item.label).toBe('My API');
  });
});
