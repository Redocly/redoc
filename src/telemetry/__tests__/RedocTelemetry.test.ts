import { describe, it, expect, vi, beforeEach } from 'vitest';

const initMock = vi.fn();
const sendMock = vi.fn();

vi.mock('@redocly/redoc-opentelemetry', () => ({
  Telemetry: class Telemetry {
    init(config: unknown): void {
      initMock(config);
    }
    send(event: unknown, data?: unknown): void {
      sendMock(event, data);
    }
    updateCloudEventData(): void {}
    forceFlush(): Promise<void> {
      return Promise.resolve();
    }
  },
}));

import { RedocTelemetry } from '../RedocTelemetry.js';
import {
  DEFAULT_SERVICE_NAME,
  DEFAULT_TYPE_OF_USAGE,
  PAGE_URI,
  TELEMETRY_DISABLED_BY_DEFAULT,
} from '../defaults.js';

// A page-level event never receives a second page item, so it isolates the specType merge.
const PAGE_EVENT = 'com.redocly.page.viewed';
const UI_EVENT = 'com.redocly.sidebar.collapsed';

describe('RedocTelemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
            // Edition-specific: `realm-ui` for portal, `redoc-ce` in the community tree.
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

      // `react` in the community tree, unset in enterprise.
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
    it('calls super.send with event and undefined when data is omitted', () => {
      const telemetry = new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
      });

      telemetry.send(PAGE_EVENT);

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith(PAGE_EVENT, undefined);
    });

    it('calls super.send with event and data when data is not an array', () => {
      const telemetry = new RedocTelemetry({
        specType: 'openapi',
        serviceVersion: '1.0.0',
      });
      const data = { foo: 'bar' };

      telemetry.send(PAGE_EVENT, data as never);

      expect(sendMock).toHaveBeenCalledWith(PAGE_EVENT, data);
    });

    it('enriches each object in array data with specType and calls super.send', () => {
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
});
