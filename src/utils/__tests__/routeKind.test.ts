import { describe, expect, it } from 'vitest';

import type { ApiItemContent } from '../../types/store.js';
import type { RouteItem } from '../routing.js';

import { kindOfContent, routeKindOf } from '../routeKind.js';

const content = (partial: Partial<ApiItemContent>): ApiItemContent =>
  ({ contentType: 'item', children: [], ...partial }) as ApiItemContent;

describe('kindOfContent', () => {
  it('maps content types and item variants to route kinds', () => {
    expect(kindOfContent(null)).toBe('root');
    expect(kindOfContent(content({ contentType: 'overview' }))).toBe('root');
    expect(kindOfContent(content({ contentType: 'group' }))).toBe('group');
    expect(kindOfContent(content({ itemVariant: 'httpItem' }))).toBe('operation');
    expect(kindOfContent(content({ itemVariant: 'channelOperation' }))).toBe('operation');
    expect(kindOfContent(content({ itemVariant: 'mutation' }))).toBe('operation');
    expect(kindOfContent(content({ itemVariant: 'channel' }))).toBe('channel');
    expect(kindOfContent(content({ itemVariant: 'message' }))).toBe('message');
    expect(kindOfContent(content({ itemVariant: 'schema' }))).toBe('schema');
    expect(kindOfContent(content({ itemVariant: 'object' }))).toBe('type');
    expect(kindOfContent(content({ itemVariant: 'enum' }))).toBe('type');
    expect(kindOfContent(content({ itemVariant: 'markdown' }))).toBe('other');
    expect(kindOfContent(content({}))).toBe('other');
  });
});

describe('routeKindOf', () => {
  it('returns other for an unresolved route', () => {
    expect(routeKindOf(undefined)).toBe('other');
  });

  it('reports the content kind of a resolved route', () => {
    const route: RouteItem = {
      path: '/pets',
      label: 'Pets',
      content: content({ itemVariant: 'httpItem' }),
    };
    expect(routeKindOf(route)).toBe('operation');
  });
});
