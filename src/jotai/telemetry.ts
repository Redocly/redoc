import { atom } from 'jotai';

export type TelemetryAtom = {
  data?: {
    performanceMetrics?: {
      cls: number;
      lcp: number;
      fcp: number;
      ttfb: number;
    };
    extensions?: string[];
    requestBodies?: string[];
    operationsCount?: number;
  };
  status?: 'initializing' | 'ready' | 'failed' | 'sent';
};

export const defaultTelemetryValue: TelemetryAtom = {
  data: undefined,
  status: 'initializing',
};

export const telemetryAtom = atom<TelemetryAtom>(defaultTelemetryValue);

export const statusTelemetryAtom = atom<TelemetryAtom['status'], [TelemetryAtom['status']], void>(
  (get) => get(telemetryAtom).status,
  (get, set, status: TelemetryAtom['status']) => {
    set(telemetryAtom, { ...get(telemetryAtom), status });
  },
);

export const dataTelemetryAtom = atom<
  TelemetryAtom['data'],
  [Partial<TelemetryAtom['data']>],
  void
>(
  (get) => get(telemetryAtom).data,
  (get, set, data: Partial<TelemetryAtom['data']>) => {
    const currentTelemetry = get(telemetryAtom);
    set(telemetryAtom, {
      ...currentTelemetry,
      data: { ...(currentTelemetry.data || {}), ...data },
    });
  },
);
