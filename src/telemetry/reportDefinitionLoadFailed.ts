import type { RedocTelemetryConfig } from './RedocTelemetry.js';

import { DefinitionLoadError, errorMessage } from '../utils/definitionLoadError.js';
import { RESOURCES } from './events.js';
import { RedocTelemetry } from './RedocTelemetry.js';
import { sanitizeLoadFailureMessage } from './sanitizeError.js';

type ReportOptions = {
  source: 'url' | 'inline';
  durationMs: number;
  /** Removed from the message, which the loaders build with it as passed, relative or not. */
  specUrl?: string;
  telemetryConfig?: Partial<RedocTelemetryConfig>;
};

/** Sends `definition.loadFailed` with its own instance: the loader renders above any provider. */
export function reportDefinitionLoadFailed(
  error: unknown,
  { source, durationMs, specUrl, telemetryConfig }: ReportOptions,
): void {
  const details = error instanceof DefinitionLoadError ? error : undefined;
  const message = sanitizeLoadFailureMessage(errorMessage(error), specUrl);
  const telemetry = new RedocTelemetry(telemetryConfig ?? {});
  telemetry.sendDefinitionLoadFailedMessage([
    {
      ...RESOURCES.definitionLoad,
      stage: details?.stage ?? 'bundle',
      source,
      ...(details?.httpStatus !== undefined ? { httpStatus: details.httpStatus } : {}),
      durationMs,
      ...(message ? { message } : {}),
      ...(telemetry.typeOfUsage ? { typeOfUsage: telemetry.typeOfUsage } : {}),
    },
  ]);
  void telemetry.forceFlush();
}
