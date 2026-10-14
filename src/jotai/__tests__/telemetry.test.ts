import { describe, expect, it } from 'vitest';
import { createStore } from 'jotai';

import {
  SCHEMA_EXPAND_EVENT_CAP,
  markNavigationCauseAtom,
  navigationCauseAtom,
  recordSectionViewedAtom,
  recordTelemetryEventAtom,
  recordVisibilityAtom,
  telemetrySessionAtom,
} from '../telemetry.js';

describe('telemetry session store', () => {
  it('counts every UI event and the specialised counters', () => {
    const store = createStore();

    expect(
      store.set(recordTelemetryEventAtom, {
        event: 'com.redocly.sidebarItem.clicked',
        data: [{ type: 'link', depth: 1 }],
      }),
    ).toBe(true);
    store.set(recordTelemetryEventAtom, { event: 'com.redocly.search.query', data: [{}] });
    store.set(recordTelemetryEventAtom, {
      event: 'com.redocly.schemaField.expanded',
      data: [{ expanded: true, depth: 3 }],
    });
    store.set(recordTelemetryEventAtom, {
      event: 'com.redocly.schemaField.expanded',
      data: [{ expanded: false, depth: 5 }],
    });

    const session = store.get(telemetrySessionAtom);
    expect(session).toMatchObject({
      interactions: 4,
      sidebarClicks: 1,
      searches: 1,
      schemaExpands: 1,
      maxSchemaDepth: 3,
      cappedEvents: false,
    });
    expect(session.firstInteractionMs).toBeTypeOf('number');
  });

  it('ignores page-level events', () => {
    const store = createStore();
    expect(
      store.set(recordTelemetryEventAtom, { event: 'com.redocly.page.viewed', data: [{}] }),
    ).toBe(true);
    const session = store.get(telemetrySessionAtom);
    expect(session.interactions).toBe(0);
    expect(session.firstInteractionMs).toBeUndefined();
  });

  it('caps schema toggle events per load while keeping the counters complete', () => {
    const store = createStore();
    const send = () =>
      store.set(recordTelemetryEventAtom, {
        event: 'com.redocly.schemaField.expanded',
        data: [{ expanded: true, depth: 1 }],
      });

    for (let i = 0; i < SCHEMA_EXPAND_EVENT_CAP; i++) expect(send()).toBe(true);
    expect(send()).toBe(false);

    const session = store.get(telemetrySessionAtom);
    expect(session.cappedEvents).toBe(true);
    expect(session.schemaExpands).toBe(SCHEMA_EXPAND_EVENT_CAP + 1);
  });

  it('records distinct sections only', () => {
    const store = createStore();
    store.set(recordSectionViewedAtom, 'a');
    store.set(recordSectionViewedAtom, 'b');
    store.set(recordSectionViewedAtom, 'a');
    expect(store.get(telemetrySessionAtom).sections.size).toBe(2);
  });

  it('accumulates hidden time across hide and show', () => {
    const store = createStore();
    store.set(recordVisibilityAtom, true);
    store.set(recordVisibilityAtom, true);
    let session = store.get(telemetrySessionAtom);
    expect(session.hiddenCount).toBe(1);
    expect(session.hiddenSince).toBeTypeOf('number');

    store.set(recordVisibilityAtom, false);
    session = store.get(telemetrySessionAtom);
    expect(session.hiddenSince).toBeUndefined();
    expect(session.hiddenMs).toBeGreaterThanOrEqual(0);
  });

  it('marks the navigation cause with a timestamp', () => {
    const store = createStore();
    store.set(markNavigationCauseAtom, 'search');
    expect(store.get(navigationCauseAtom)).toMatchObject({ via: 'search', at: expect.any(Number) });
  });
});
