import type { RedocTelemetry } from './RedocTelemetry.js';

import { getPageUri } from './page.js';
import { sanitizeErrorDetails } from './sanitizeError.js';

export type ReportedError = { id: string; error: Error };

type Sender = (reported: ReportedError) => void;

const PENDING_LIMIT = 100;

// Mounted senders, oldest first; reports go to the newest.
const senders: Sender[] = [];
let collector: ReportedError[] | undefined;
const pending: ReportedError[] = [];

/** Logs with `console.error` and sends to telemetry: now when a sender is mounted, at mount otherwise, or into the open `collectReportedErrors` batch. Never throws. */
export function reportError(id: string, error: unknown, context?: string): Error {
  const normalized = error instanceof Error ? error : new Error(String(error));
  console.error('[api-docs] %s:', context ?? id, normalized);
  const reported = { id, error: normalized };
  if (collector) {
    collector.push(reported);
    return normalized;
  }
  const sender = senders.at(-1);
  if (sender) {
    sender(reported);
    return normalized;
  }
  if (pending.length >= PENDING_LIMIT) pending.shift();
  pending.push(reported);
  return normalized;
}

/** Collects what `reportError` reports until the returned function is called; it returns the batch. */
export function collectReportedErrors(): () => ReportedError[] {
  // One module-level batch: concurrent builds in one process share it.
  const batch: ReportedError[] = [];
  collector = batch;
  return () => {
    if (collector === batch) collector = undefined;
    return batch;
  };
}

/** Mounts a telemetry sender (or unmounts every sender, with `undefined`) and flushes what was reported before it. The returned function unmounts this sender; an older one, if any, takes over. */
export function setErrorSender(next: Sender | undefined): () => void {
  if (!next) {
    senders.length = 0;
    return () => {};
  }
  senders.push(next);
  for (const reported of pending.splice(0)) next(reported);
  return () => {
    const index = senders.indexOf(next);
    if (index !== -1) senders.splice(index, 1);
  };
}

const sentBuildErrors = new WeakSet<object>();

/** Sends a store's `buildErrors` once per store, however often the docs mount. */
export function sendBuildErrors(
  telemetry: RedocTelemetry,
  buildErrors: { id: string; name: string; message: string }[] | undefined,
): void {
  if (!buildErrors || sentBuildErrors.has(buildErrors)) return;
  sentBuildErrors.add(buildErrors);
  for (const { id, name, message } of buildErrors) {
    sendErrorTelemetry(telemetry, id, Object.assign(new Error(message), { name }));
  }
}

export function sendErrorTelemetry(
  telemetry: RedocTelemetry,
  id: string,
  error: Error,
  componentStack?: string | null,
): void {
  try {
    telemetry.sendErrorMessage([
      {
        id,
        object: 'error',
        uri: getPageUri(),
        ...(telemetry.typeOfUsage ? { typeOfUsage: telemetry.typeOfUsage } : {}),
        details: sanitizeErrorDetails(error, componentStack),
      },
    ]);
  } catch (telemetryError) {
    console.error('[api-docs] error telemetry failed:', telemetryError);
  }
}
