import { useEffect, useRef } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

import { getPageUri } from '../telemetry/page.js';
import { useTelemetry } from './useTelemetry.js';

/**
 * Sends `performanceMetrics.collected` once per mount, after the four vitals reported and the
 * page was first hidden or unmounted, with `inp` when the browser produced one.
 */
export function usePerformanceMetricsTelemetry(): void {
  const telemetry = useTelemetry();

  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;

  const vitalsRegisteredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (vitalsRegisteredRef.current) return;
    vitalsRegisteredRef.current = true;

    const uri = getPageUri();
    const metrics: { cls?: number; lcp?: number; fcp?: number; ttfb?: number; inp?: number } = {};
    let sent = false;
    let hidden = false;

    const trySend = (): void => {
      if (sent || !hidden) return;
      if (
        metrics.cls === undefined ||
        metrics.lcp === undefined ||
        metrics.fcp === undefined ||
        metrics.ttfb === undefined
      ) {
        return;
      }
      sent = true;
      telemetryRef.current.sendPerformanceMetricsMessage([
        {
          id: 'metrics',
          object: 'metrics',
          uri,
          cls: metrics.cls,
          lcp: metrics.lcp,
          fcp: metrics.fcp,
          ttfb: metrics.ttfb,
          ...(metrics.inp !== undefined ? { inp: metrics.inp } : {}),
        },
      ]);
      void telemetryRef.current.forceFlush();
    };

    const onHidden = (event: Event): void => {
      if (event.type === 'visibilitychange' && document.visibilityState !== 'hidden') return;
      hidden = true;
      trySend();
    };
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', onHidden);

    onCLS((m) => {
      metrics.cls = m.value;
      trySend();
    });
    onLCP((m) => {
      metrics.lcp = m.value;
      trySend();
    });
    onFCP((m) => {
      metrics.fcp = m.value;
      trySend();
    });
    onTTFB((m) => {
      metrics.ttfb = m.value;
      trySend();
    });
    onINP((m) => {
      metrics.inp = m.value;
      trySend();
    });

    return () => {
      document.removeEventListener('visibilitychange', onHidden);
      window.removeEventListener('pagehide', onHidden);
      hidden = true;
      trySend();
    };
  }, []);
}
