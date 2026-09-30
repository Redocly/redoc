import { useEffect, useRef } from 'react';
import { useStore } from 'jotai';
import { useLocation } from 'react-router';

import type { InitialTelemetryContext } from '../telemetry/initialPayload.js';
import type { RouteIndex } from '../utils/routing.js';

import { layoutAtom } from '../jotai/app.js';
import { globalStoreAtom } from '../jotai/store.js';
import { buildInitialPayload } from '../telemetry/initialPayload.js';
import { getPageUri } from '../telemetry/page.js';
import { routeKindOf } from '../utils/routeKind.js';
import { resolveRouteByPathname } from '../utils/routing.js';
import { useTelemetry } from './useTelemetry.js';

export function useInitialTelemetry(
  routeIndex: RouteIndex,
  context?: InitialTelemetryContext,
): void {
  const telemetry = useTelemetry();
  const store = useStore();
  const { pathname } = useLocation();

  const alreadySent = useRef(false);

  useEffect(() => {
    if (alreadySent.current) return;
    alreadySent.current = true;

    const { items, store: apiStore, definition } = store.get(globalStoreAtom);

    telemetry.sendInitialMessage([
      buildInitialPayload({
        uri: getPageUri(),
        layout: store.get(layoutAtom),
        typeOfUsage: telemetry.typeOfUsage,
        items,
        apiStore,
        definition,
        hostname: window.location.hostname,
        landedOn: routeKindOf(resolveRouteByPathname(routeIndex, pathname)),
        buildTimings: context?.buildTimings,
        options: context?.options,
      }),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
