import { createContext, useContext } from 'react';

import { RedocTelemetry } from '../telemetry/RedocTelemetry.js';

export const noopTelemetry = new RedocTelemetry({ disabled: true });

export const TelemetryContext = createContext<RedocTelemetry>(noopTelemetry);

export function useRedocTelemetry(): RedocTelemetry {
  return useContext(TelemetryContext);
}
