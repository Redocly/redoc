import { describe, it, expect, vi, beforeEach } from 'vitest';

const initMock = vi.fn();
const sendMock = vi.fn();
const forceFlushMock = vi.fn();
const startSpanMock = vi.fn();
const withTracerMock = vi.fn();
const cloudEventDataMock = vi.fn();

vi.mock('@redocly/redoc-opentelemetry', () => ({
  Telemetry: class Telemetry {
    otelClient = {};
    tracer = { traceStep: () => undefined };
    init(config: unknown): void {
      initMock.call(this, config);
    }
    send(event: unknown, data?: unknown): void {
      sendMock.call(this, event, data);
    }
    updateCloudEventData(cloudEventData: () => unknown): void {
      cloudEventDataMock(cloudEventData());
    }
    forceFlush(): Promise<void> {
      forceFlushMock.call(this);
      return Promise.resolve();
    }
    startSpan(...args: unknown[]): unknown {
      return startSpanMock.call(this, ...args);
    }
    withTracer(tracerName: string): unknown {
      return withTracerMock.call(this, tracerName);
    }
  },
}));

import type { RedocTelemetry as RedocTelemetryClass } from '../RedocTelemetry.js';
import {
  DEFAULT_SERVICE_NAME,
  DEFAULT_TYPE_OF_USAGE,
  PAGE_URI,
  TELEMETRY_DISABLED_BY_DEFAULT,
} from '../defaults.js';

// A page-level event never receives a second page item, so it isolates the specType merge.
const PAGE_EVENT = 'com.redocly.page.viewed';
const UI_EVENT = 'com.redocly.sidebar.collapsed';

let RedocTelemetry: typeof RedocTelemetryClass;

describe('RedocTelemetry', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // A fresh module per test: SDK clients are shared for the life of the module, like a page
    vi.resetModules();
    ({ RedocTelemetry } = await import('../RedocTelemetry.js'));
  });

  describe('constructor', () => {
    it('calls init with default collector URL and service name when not provided', () => {
      new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
      });

      expect(initMock).toHaveBeenCalledTimes(1);
      expect(initMock).toHaveBeenCalledWith(
        expect.objectContaining({
          otel: expect.objectContaining({
            collectorTraceUrl: 'https://otel.cloud.redocly.com/v1/traces',
            // Edition-specific, see telemetry/defaults.
            serviceName: DEFAULT_SERVICE_NAME,
            serviceVersion: '1.0.0',
          }),
        }),
      );
    });

    it('falls back to the edition default when disabled is not provided', () => {
      new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
      });

      expect(initMock).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: TELEMETRY_DISABLED_BY_DEFAULT,
        }),
      );
    });

    it('exposes typeOfUsage for the events whose schema declares it', () => {
      const telemetry = new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
        typeOfUsage: 'docker',
      });

      expect(telemetry.typeOfUsage).toBe('docker');
    });

    it('falls back to the edition default typeOfUsage when the host does not report one', () => {
      const telemetry = new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
      });

      // Edition-specific, see telemetry/defaults.
      expect(telemetry.typeOfUsage).toBe(DEFAULT_TYPE_OF_USAGE);
    });

    it('calls init with custom collectorUrl and serviceName when provided', () => {
      new RedocTelemetry({
        specType: 'asyncapi',
        serviceVersion: '2.0.0',
        collectorUrl: 'https://custom.example.com/v1/traces',
        serviceName: 'custom-service',
      });

      expect(initMock).toHaveBeenCalledWith(
        expect.objectContaining({
          otel: expect.objectContaining({
            collectorTraceUrl: 'https://custom.example.com/v1/traces',
            serviceName: 'custom-service',
            serviceVersion: '2.0.0',
          }),
        }),
      );
    });

    it('calls init with disabled when config.disabled is true', () => {
      new RedocTelemetry({
        specType: 'graphql',
        serviceVersion: '1.0.0',
        disabled: true,
      });

      expect(initMock).toHaveBeenCalledWith(
        expect.objectContaining({
          disabled: true,
        }),
      );
    });
  });

  describe('send', () => {
    it('sends event and undefined when data is omitted', () => {
      const telemetry = new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
      });

      telemetry.send(PAGE_EVENT);

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith(PAGE_EVENT, undefined);
    });

    it('sends event and data when data is not an array', () => {
      const telemetry = new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
      });
      const data = { foo: 'bar' };

      telemetry.send(PAGE_EVENT, data as never);

      expect(sendMock).toHaveBeenCalledWith(PAGE_EVENT, data);
    });

    it('enriches each object in array data with specType and sends it', () => {
      const telemetry = new RedocTelemetry({
        specType: 'asyncapi',
        serviceVersion: '1.0.0',
      });
      const data = [{ id: 'a' }, { id: 'b' }];

      telemetry.send(PAGE_EVENT, data as never);

      expect(sendMock).toHaveBeenCalledWith(PAGE_EVENT, [
        { id: 'a', specType: 'asyncapi' },
        { id: 'b', specType: 'asyncapi' },
      ]);
    });

    it('passes through non-object array items unchanged', () => {
      const telemetry = new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
      });
      const data = [{ id: 'a' }, null, 'string', 42];

      telemetry.send(PAGE_EVENT, data as never);

      expect(sendMock).toHaveBeenCalledWith(PAGE_EVENT, [
        { id: 'a', specType: 'openapi' },
        null,
        'string',
        42,
      ]);
    });

    it('leaves specType off when the instance has none', () => {
      const telemetry = new RedocTelemetry({ serviceVersion: '1.0.0' });

      telemetry.send(PAGE_EVENT, [{ id: 'a' }] as never);

      expect(sendMock).toHaveBeenCalledWith(PAGE_EVENT, [{ id: 'a' }]);
    });

    it('pre-fills the page item for UI events exactly when the edition defines PAGE_URI', () => {
      const telemetry = new RedocTelemetry({ specType: 'openapi', serviceVersion: '1.0.0' });

      telemetry.send(UI_EVENT, [{ id: 'sidebarCollapse' }] as never);

      const item = { id: 'sidebarCollapse', specType: 'openapi' };
      const expected =
        PAGE_URI === undefined ? [item] : [item, { id: PAGE_URI, object: 'page', uri: PAGE_URI }];
      expect(sendMock).toHaveBeenCalledWith(UI_EVENT, expected);
    });

    it('never adds a page item to page-level events', () => {
      const telemetry = new RedocTelemetry({ specType: 'openapi', serviceVersion: '1.0.0' });

      telemetry.send(PAGE_EVENT, [{ id: 'x', object: 'page' }] as never);

      expect((sendMock.mock.calls[0][1] as unknown[]).length).toBe(1);
    });

    it('lets beforeSend observe the final items and veto the send', () => {
      const beforeSend = vi.fn(() => false);
      const telemetry = new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
        beforeSend,
      });

      telemetry.send(UI_EVENT, [{ id: 'sidebarCollapse' }] as never);

      expect(beforeSend).toHaveBeenCalledWith(UI_EVENT, expect.any(Array));
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  describe('shared SDK client', () => {
    it('initializes one SDK client for every instance with the same collector, service and opt-out', () => {
      new RedocTelemetry({ serviceVersion: '1.0.0' });
      new RedocTelemetry({ serviceVersion: '1.0.0', specType: 'graphql' });

      expect(initMock).toHaveBeenCalledTimes(1);
      expect(cloudEventDataMock).toHaveBeenCalledWith({
        source: 'urn:redocly:redoc:ui',
        origin: 'redocUi',
        signal: 'log',
      });
    });

    it('initializes another SDK client for another collector, service or opt-out', () => {
      new RedocTelemetry({ serviceVersion: '1.0.0' });
      new RedocTelemetry({
        serviceVersion: '1.0.0',
        collectorUrl: 'https://collector.example.com/v1/traces',
      });
      new RedocTelemetry({ serviceVersion: '1.0.0', serviceName: 'other-service' });
      new RedocTelemetry({
        serviceVersion: '1.0.0',
        disabled: !TELEMETRY_DISABLED_BY_DEFAULT,
      });
      new RedocTelemetry({ serviceVersion: '2.0.0' });

      expect(initMock).toHaveBeenCalledTimes(5);
    });

    it('keeps the spec type and counters of each instance', () => {
      const openapiCounters = vi.fn();
      const graphqlCounters = vi.fn();
      const openapi = new RedocTelemetry({
        serviceVersion: '1.0.0',
        specType: 'openapi',
        beforeSend: openapiCounters,
      });
      const graphql = new RedocTelemetry({
        serviceVersion: '1.0.0',
        specType: 'graphql',
        beforeSend: graphqlCounters,
      });

      openapi.send(PAGE_EVENT, [{ id: 'a' }] as never);
      graphql.send(PAGE_EVENT, [{ id: 'b' }] as never);

      expect(sendMock.mock.calls).toEqual([
        [PAGE_EVENT, [{ id: 'a', specType: 'openapi' }]],
        [PAGE_EVENT, [{ id: 'b', specType: 'graphql' }]],
      ]);
      expect(openapiCounters).toHaveBeenCalledTimes(1);
      expect(graphqlCounters).toHaveBeenCalledTimes(1);
    });

    it('sends each event through the SDK client built for its opt-out', () => {
      const optedIn = new RedocTelemetry({ serviceVersion: '1.0.0', disabled: false });
      const optedOut = new RedocTelemetry({ serviceVersion: '1.0.0', disabled: true });

      optedIn.send(PAGE_EVENT);
      optedOut.send(PAGE_EVENT);

      const clientWith = (disabled: boolean) =>
        initMock.mock.contexts[
          initMock.mock.calls.findIndex(([config]) => config.disabled === disabled)
        ];
      expect(sendMock.mock.contexts[0]).toBe(clientWith(false));
      expect(sendMock.mock.contexts[1]).toBe(clientWith(true));
    });

    it('flushes the SDK client that sends its events', async () => {
      await new RedocTelemetry({ serviceVersion: '1.0.0' }).forceFlush();

      expect(forceFlushMock).toHaveBeenCalledTimes(1);
      expect(forceFlushMock.mock.contexts[0]).toBe(initMock.mock.contexts[0]);
    });

    it('starts spans and tracers on the SDK client that sends its events', () => {
      const telemetry = new RedocTelemetry({ serviceVersion: '1.0.0' });
      const sdkClient = initMock.mock.contexts[0] as { otelClient: unknown; tracer: unknown };

      const parentContext = {} as never;
      const span = {};
      const scoped = {};
      startSpanMock.mockReturnValueOnce(span);
      withTracerMock.mockReturnValueOnce(scoped);

      expect(telemetry.startSpan(PAGE_EVENT, undefined, parentContext)).toBe(span);
      expect(telemetry.withTracer('scoped')).toBe(scoped);

      expect(startSpanMock).toHaveBeenCalledWith(PAGE_EVENT, undefined, parentContext);
      expect(startSpanMock.mock.contexts[0]).toBe(sdkClient);
      expect(withTracerMock.mock.contexts[0]).toBe(sdkClient);
      expect(telemetry.tracer).toBe(sdkClient.tracer);
      expect(telemetry.otelClient).toBe(sdkClient.otelClient);
    });
  });
});
