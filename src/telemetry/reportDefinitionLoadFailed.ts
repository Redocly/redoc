import type { RedocTelemetryConfig } from './RedocTelemetry.js';

import { DefinitionLoadError } from '../utils/definitionLoadError.js';
import { RESOURCES } from './events.js';
import { RedocTelemetry } from './RedocTelemetry.js';

type ReportOptions = {
  source: 'url' | 'inline';
  durationMs: number;
  telemetryConfig?: Partial<RedocTelemetryConfig>;
};

/** Sends `definition.loadFailed` with its own instance: the loader renders above any provider. */
export function reportDefinitionLoadFailed(
  error: unknown,
  { source, durationMs, telemetryConfig }: ReportOptions,
): void {
  const details = error instanceof DefinitionLoadError ? error : undefined;
  const telemetry = new RedocTelemetry(telemetryConfig ?? {});
  telemetry.sendDefinitionLoadFailedMessage([
    {
      ...RESOURCES.definitionLoad,
      stage: details?.stage ?? 'bundle',
      source,
      ...(details?.httpStatus !== undefined ? { httpStatus: details.httpStatus } : {}),
      durationMs,
      ...(telemetry.typeOfUsage ? { typeOfUsage: telemetry.typeOfUsage } : {}),
    },
  ]);
  void telemetry.forceFlush();
}
