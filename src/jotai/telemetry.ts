import { atom } from 'jotai';

import type { EventType } from '@redocly/redoc-opentelemetry';

import { isRecord } from '../utils/is-record.js';
import { PAGE_LEVEL_EVENTS } from '../telemetry/page.js';

export type NavigationCause = 'sidebar' | 'search' | 'referencedIn' | 'history';

export type TelemetrySession = {
  firstInteractionMs?: number;
  sections: ReadonlySet<string>;
  sidebarClicks: number;
  schemaExpands: number;
  maxSchemaDepth: number;
  searches: number;
  interactions: number;
  hiddenCount: number;
  hiddenMs: number;
  hiddenSince?: number;
  schemaExpandEvents: number;
  cappedEvents: boolean;
};

/** Per-load cap on `schemaField.expanded` events sent over the network; counters stay complete. */
export const SCHEMA_EXPAND_EVENT_CAP = 50;

const INITIAL_SESSION: TelemetrySession = {
  sections: new Set(),
  sidebarClicks: 0,
  schemaExpands: 0,
  maxSchemaDepth: 0,
  searches: 0,
  interactions: 0,
  hiddenCount: 0,
  hiddenMs: 0,
  schemaExpandEvents: 0,
  cappedEvents: false,
};

export const telemetrySessionAtom = atom<TelemetrySession>(INITIAL_SESSION);

/** Counts one UI event; returns `false` when the event is over the per-load cap and must not be sent. */
export const recordTelemetryEventAtom = atom(
  null,
  (get, set, { event, data }: { event: EventType; data: unknown[] }): boolean => {
    if (PAGE_LEVEL_EVENTS.has(event)) return true;

    const session = get(telemetrySessionAtom);
    const item = isRecord(data[0]) ? data[0] : {};
    const next: TelemetrySession = {
      ...session,
      interactions: session.interactions + 1,
      firstInteractionMs: session.firstInteractionMs ?? performance.now(),
    };
    let allowed = true;

    if (event === 'com.redocly.sidebarItem.clicked') next.sidebarClicks += 1;
    if (event === 'com.redocly.search.query') next.searches += 1;
    if (event === 'com.redocly.schemaField.expanded') {
      if (item.expanded === true) {
        next.schemaExpands += 1;
        next.maxSchemaDepth = Math.max(session.maxSchemaDepth, Number(item.depth) || 0);
      }
      next.schemaExpandEvents += 1;
      if (next.schemaExpandEvents > SCHEMA_EXPAND_EVENT_CAP) {
        next.cappedEvents = true;
        allowed = false;
      }
    }

    set(telemetrySessionAtom, next);
    return allowed;
  },
);

export const recordSectionViewedAtom = atom(null, (get, set, sectionId: string) => {
  const session = get(telemetrySessionAtom);
  if (session.sections.has(sectionId)) return;
  set(telemetrySessionAtom, { ...session, sections: new Set(session.sections).add(sectionId) });
});

export const recordVisibilityAtom = atom(null, (get, set, hidden: boolean) => {
  const session = get(telemetrySessionAtom);
  if (hidden) {
    if (session.hiddenSince !== undefined) return;
    set(telemetrySessionAtom, {
      ...session,
      hiddenCount: session.hiddenCount + 1,
      hiddenSince: performance.now(),
    });
    return;
  }
  if (session.hiddenSince === undefined) return;
  set(telemetrySessionAtom, {
    ...session,
    hiddenMs: session.hiddenMs + (performance.now() - session.hiddenSince),
    hiddenSince: undefined,
  });
});

export const navigationCauseAtom = atom<{ via: NavigationCause; at: number } | null>(null);

export const markNavigationCauseAtom = atom(null, (_get, set, via: NavigationCause) => {
  set(navigationCauseAtom, { via, at: performance.now() });
});
