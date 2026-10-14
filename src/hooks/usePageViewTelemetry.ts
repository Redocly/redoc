import { useEffect, useRef } from 'react';
import { useStore } from 'jotai';
import { useLocation } from 'react-router';

import type { EventPayload } from '@redocly/redoc-opentelemetry';
import type { RouteIndex } from '../utils/routing.js';

import { layoutAtom } from '../jotai/app.js';
import { globalOptionsAtom } from '../jotai/store.js';
import { markNavigationCauseAtom, navigationCauseAtom } from '../jotai/telemetry.js';
import { PAGE_VIEWED_PER_ROUTE } from '../telemetry/defaults.js';
import { getPageUri } from '../telemetry/page.js';
import { routeKindOf } from '../utils/routeKind.js';
import { resolveRouteByPathname } from '../utils/routing.js';
import { normalizeProtocol } from '../telemetry/fields.js';
import { useTelemetry } from './useTelemetry.js';

type Via = NonNullable<EventPayload<'com.redocly.page.viewed'>[0]['via']>;

/** A navigation cause older than this belongs to a click that did not navigate. */
const CAUSE_TTL_MS = 2000;

export function usePageViewTelemetry(routeIndex: RouteIndex): void {
  const telemetry = useTelemetry();
  const store = useStore();
  const { pathname } = useLocation();

  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;
  const routeIndexRef = useRef(routeIndex);
  routeIndexRef.current = routeIndex;
  const sentForRef = useRef<string | null>(null);

  useEffect(() => {
    if (!PAGE_VIEWED_PER_ROUTE || typeof window === 'undefined') return;
    const onPopState = (): void => {
      store.set(markNavigationCauseAtom, 'history');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [store]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const first = sentForRef.current === null;
    if (!first && !PAGE_VIEWED_PER_ROUTE) return;
    if (sentForRef.current === pathname) return;
    sentForRef.current = pathname;

    const uri = getPageUri();
    const options = store.get(globalOptionsAtom);
    const protocol =
      options.specType === 'asyncapi' && options.protocol
        ? normalizeProtocol(options.protocol)
        : undefined;
    const route = resolveRouteByPathname(routeIndexRef.current, pathname);

    telemetryRef.current.sendViewedMessage([
      {
        id: uri,
        object: 'page',
        uri,
        layout: store.get(layoutAtom),
        kind: routeKindOf(route),
        via: first ? 'load' : consumeNavigationCause(store),
        ...(protocol ? { protocol } : {}),
      },
    ]);
  }, [pathname, store]);
}

function consumeNavigationCause(store: ReturnType<typeof useStore>): Via {
  const cause = store.get(navigationCauseAtom);
  store.set(navigationCauseAtom, null);
  return cause && performance.now() - cause.at < CAUSE_TTL_MS ? cause.via : 'link';
}
