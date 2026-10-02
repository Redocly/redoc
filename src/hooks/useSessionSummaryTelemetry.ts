import { useEffect, useRef } from 'react';
import { useStore } from 'jotai';

import { activeScrollSectionAtom } from '../jotai/app.js';
import {
  recordSectionViewedAtom,
  recordVisibilityAtom,
  telemetrySessionAtom,
} from '../jotai/telemetry.js';
import { getPageUri } from '../telemetry/page.js';
import { useTelemetry } from './useTelemetry.js';

/** A hide that added less visible time than this, and no activity, sends no snapshot. */
const MIN_VISIBLE_DELTA_MS = 1000;

/**
 * Sends the `page.time` summary of the current page load on every hide, on `pagehide` and on
 * unmount (a portal navigating away from the API docs keeps the tab visible).
 * Counters are cumulative and a snapshot that adds nothing is skipped; consumers keep the
 * largest snapshot per session.
 */
export function useSessionSummaryTelemetry(): void {
  const telemetry = useTelemetry();
  const store = useStore();

  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const startedAt = performance.now();
    const uri = getPageUri();
    let lastSent: { visibleMs: number; interactions: number; sections: number } | undefined;

    const unsubscribe = store.sub(activeScrollSectionAtom, () => {
      const sectionId = store.get(activeScrollSectionAtom);
      if (sectionId) store.set(recordSectionViewedAtom, sectionId);
    });

    const snapshot = (): void => {
      const session = store.get(telemetrySessionAtom);
      const at = performance.now();
      const hiddenMs =
        session.hiddenMs + (session.hiddenSince === undefined ? 0 : at - session.hiddenSince);
      const durationMs = Math.max(0, Math.round(at - startedAt));
      const visibleMs = Math.max(0, Math.round(durationMs - hiddenMs));
      if (
        lastSent &&
        visibleMs - lastSent.visibleMs < MIN_VISIBLE_DELTA_MS &&
        session.interactions === lastSent.interactions &&
        session.sections.size === lastSent.sections
      ) {
        return;
      }
      lastSent = { visibleMs, interactions: session.interactions, sections: session.sections.size };

      telemetryRef.current.sendPageTimeMessage([
        {
          id: uri,
          object: 'page',
          uri,
          durationMs,
          visibleMs,
          ...(session.firstInteractionMs !== undefined
            ? {
                firstInteractionMs: Math.max(0, Math.round(session.firstInteractionMs - startedAt)),
              }
            : {}),
          sectionsViewed: session.sections.size,
          sidebarClicks: session.sidebarClicks,
          schemaExpands: session.schemaExpands,
          ...(session.maxSchemaDepth > 0 ? { maxSchemaDepth: session.maxSchemaDepth } : {}),
          searches: session.searches,
          interactions: session.interactions,
          hiddenCount: session.hiddenCount,
          cappedEvents: session.cappedEvents,
        },
      ]);
      void telemetryRef.current.forceFlush();
    };

    const onVisibilityChange = (): void => {
      const hidden = document.visibilityState === 'hidden';
      store.set(recordVisibilityAtom, hidden);
      if (hidden) snapshot();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', snapshot);
    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', snapshot);
      snapshot();
    };
  }, [store]);
}
