import { useContext, useMemo } from 'react';
import { useAtomValue, useStore } from 'jotai';

import type { RedocTelemetryConfig } from './RedocTelemetry.js';

import { TelemetryContext, noopTelemetry } from '../contexts/telemetry.js';
import { recordTelemetryEventAtom } from '../jotai/telemetry.js';
import { specTypeAtom } from '../jotai/store.js';
import { RedocTelemetry } from './RedocTelemetry.js';

export function useRedocTelemetryInstance(config?: Partial<RedocTelemetryConfig>): RedocTelemetry {
  const inherited = useContext(TelemetryContext);
  const store = useStore();
  const detectedSpecType = useAtomValue(specTypeAtom);
  const { specType, collectorUrl, serviceName, serviceVersion, disabled, typeOfUsage } =
    config ?? {};

  return useMemo(() => {
    if (inherited !== noopTelemetry) return inherited;
    return new RedocTelemetry({
      specType: specType ?? detectedSpecType,
      collectorUrl,
      // Left to RedocTelemetry so each edition reports its own `service.name`.
      serviceName,
      serviceVersion,
      disabled,
      typeOfUsage,
      beforeSend: (event, items) => store.set(recordTelemetryEventAtom, { event, data: items }),
    });
  }, [
    inherited,
    store,
    detectedSpecType,
    specType,
    collectorUrl,
    serviceName,
    serviceVersion,
    disabled,
    typeOfUsage,
  ]);
}
