import { Telemetry } from '@redocly/redoc-opentelemetry';

import type { EventType, EventPayload } from '@redocly/redoc-opentelemetry';

import pkg from '../../package.json' with { type: 'json' };

import {
  DEFAULT_SERVICE_NAME,
  DEFAULT_TYPE_OF_USAGE,
  TELEMETRY_DISABLED_BY_DEFAULT,
} from './defaults.js';
import { withPageItem } from './page.js';

export type SpecType = 'openapi' | 'asyncapi' | 'graphql';

export type TypeOfUsage = 'html' | 'cli' | 'react' | 'init' | 'docker' | 'vs-code';

/** Sees every array payload before it is sent; returning `false` drops the event. */
export type BeforeSend = (event: EventType, items: unknown[]) => boolean | void;

export interface RedocTelemetryConfig {
  specType?: SpecType;
  collectorUrl?: string;
  serviceName?: string;
  disabled?: boolean;
  serviceVersion?: string;
  typeOfUsage?: TypeOfUsage;
  beforeSend?: BeforeSend;
}
const OTEL_TRACES_URL = 'https://otel.cloud.redocly.com/v1/traces';
const EVENT_SOURCE = 'urn:redocly:redoc:ui';

type CloudEventBaseData = ReturnType<Parameters<Telemetry['updateCloudEventData']>[0]>;

const sdkClients = new Map<string, Telemetry>();

function sharedSdkClient(config: RedocTelemetryConfig): Telemetry {
  const otel = {
    isProd: process.env.NODE_ENV === 'production' || process.env.ENABLE_LOCAL_TELEMETRY === 'true',
    serviceVersion: config.serviceVersion || `${pkg.name}@${pkg.version}`,
    version: '1.0.0',
    collectorTraceUrl: config.collectorUrl || OTEL_TRACES_URL,
    serviceName: config.serviceName || DEFAULT_SERVICE_NAME,
    tracerName: 'client-telemetry',
  };
  const disabled = config.disabled ?? TELEMETRY_DISABLED_BY_DEFAULT;
  const key = JSON.stringify([
    otel.collectorTraceUrl,
    otel.serviceName,
    otel.serviceVersion,
    disabled,
  ]);

  let client = sdkClients.get(key);
  if (!client) {
    client = new Telemetry();
    client.init({ otel, disabled });
    client.updateCloudEventData(
      () => ({ source: EVENT_SOURCE, origin: 'redocUi', signal: 'log' }) as CloudEventBaseData,
    );
    sdkClients.set(key, client);
  }
  return client;
}

/**
 * One Redoc's telemetry; instances with the same collector config share one SDK client per page.
 * The inherited SDK state is never initialized: override every SDK method that sends, flushes
 * or traces to call `sdkClient`.
 */
export class RedocTelemetry extends Telemetry {
  private specType: SpecType | undefined;
  private beforeSend: BeforeSend | undefined;
  private readonly sdkClient: Telemetry;
  readonly typeOfUsage: TypeOfUsage | undefined;

  constructor(config: RedocTelemetryConfig) {
    super();
    this.specType = config.specType;
    this.beforeSend = config.beforeSend;
    this.typeOfUsage = config.typeOfUsage ?? DEFAULT_TYPE_OF_USAGE;
    this.sdkClient = sharedSdkClient(config);
    this.otelClient = this.sdkClient.otelClient;
    this.tracer = this.sdkClient.tracer;
  }

  startSpan(...args: Parameters<Telemetry['startSpan']>): ReturnType<Telemetry['startSpan']> {
    return this.sdkClient.startSpan(...args);
  }

  withTracer(tracerName: string): Telemetry {
    return this.sdkClient.withTracer(tracerName);
  }

  send<T extends EventType>(event: T, data?: EventPayload<T>): void {
    if (Array.isArray(data)) {
      const specType = this.specType;
      let items: unknown[] = specType
        ? data.map((item) => (item && typeof item === 'object' ? { ...item, specType } : item))
        : [...data];
      items = withPageItem(event, items);
      if (this.beforeSend?.(event, items) === false) return;
      data = items as EventPayload<T>;
    }

    this.sdkClient.send(event, data, {
      env: process.env.NODE_ENV,
    });
  }

  forceFlush(): Promise<void> {
    return this.sdkClient.forceFlush();
  }
}
