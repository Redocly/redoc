import type { InitialTelemetryContext } from '../telemetry/initialPayload.js';
import type { RouteIndex } from '../utils/routing.js';

import { useInitialTelemetry } from './useInitialTelemetry.js';
import { usePageViewTelemetry } from './usePageViewTelemetry.js';
import { usePerformanceMetricsTelemetry } from './usePerformanceMetricsTelemetry.js';
import { useSessionSummaryTelemetry } from './useSessionSummaryTelemetry.js';

export function usePageTelemetry(
  routeIndex: RouteIndex,
  initialTelemetry?: InitialTelemetryContext,
): void {
  useInitialTelemetry(routeIndex, initialTelemetry);
  usePageViewTelemetry(routeIndex);
  usePerformanceMetricsTelemetry();
  useSessionSummaryTelemetry();
}
