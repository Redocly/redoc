import type { EventType } from '@redocly/redoc-opentelemetry';

import { PAGE_URI } from './defaults.js';

export function getPageUri(): string {
  return PAGE_URI ?? (typeof window !== 'undefined' ? window.location.href : '');
}

export const PAGE_LEVEL_EVENTS: ReadonlySet<EventType> = new Set<EventType>([
  'com.redocly.page.viewed',
  'com.redocly.page.time',
  'com.redocly.performanceMetrics.collected',
  'com.redocly.redoc.initialized',
  'com.redocly.error.occurred',
  'com.redocly.definition.loadFailed',
]);

/** Appends the constant page item so the SDK does not inject `location.href` and the referrer. */
export function withPageItem(event: EventType, items: unknown[]): unknown[] {
  if (PAGE_URI === undefined || PAGE_LEVEL_EVENTS.has(event)) return items;
  return [...items, { id: PAGE_URI, object: 'page', uri: PAGE_URI }];
}
