import type { RedocTelemetry } from '../telemetry/RedocTelemetry.js';

import { useRedocTelemetry } from '../contexts/telemetry.js';

export function useTelemetry(): RedocTelemetry {
  return useRedocTelemetry();
}
