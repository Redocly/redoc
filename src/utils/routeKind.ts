import type { EventPayload } from '@redocly/redoc-opentelemetry';

import type { ApiItemContent } from '../types/store.js';
import type { ItemVariant } from '../types/common.js';
import type { RouteItem } from './routing.js';

import { contentType } from '../types/common.js';

export type RouteKind = NonNullable<EventPayload<'com.redocly.page.viewed'>[0]['kind']>;

const VARIANT_KIND: Partial<Record<ItemVariant, RouteKind>> = {
  httpItem: 'operation',
  channelOperation: 'operation',
  query: 'operation',
  mutation: 'operation',
  subscription: 'operation',
  channel: 'channel',
  message: 'message',
  schema: 'schema',
  object: 'type',
  interface: 'type',
  input: 'type',
  union: 'type',
  enum: 'type',
  scalar: 'type',
  directive: 'type',
};

export function kindOfContent(content: ApiItemContent | null | undefined): RouteKind {
  if (!content || content.contentType === contentType.OVERVIEW) return 'root';
  if (content.contentType === contentType.GROUP) return 'group';
  return (content.itemVariant && VARIANT_KIND[content.itemVariant]) ?? 'other';
}

export function routeKindOf(route: RouteItem | undefined): RouteKind {
  return route ? kindOfContent(route.content) : 'other';
}
