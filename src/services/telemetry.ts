const OTEL_TRACES_URL = 'https://otel.blueharvest.cloud/v1/traces'; // Prod: 'https://otel.cloud.redocly.com/v1/traces';

import type { EventType, EventPayload } from '@redocly/redoc-opentelemetry';

type OtlpPrimitive =
  | { stringValue: string }
  | { boolValue: boolean }
  | { intValue: number }
  | { doubleValue: number };

type OtlpValue =
  | OtlpPrimitive
  | { arrayValue: { values: OtlpValue[] } }
  | { kvlistValue: { values: { key: string; value: OtlpValue }[] } };

class RedocTelemetry {
  private sessionId: string = '';

  private randomHex(length: 16 | 32): string {
    const arr = new Uint8Array(length / 2); // 8 bytes = 16 hex chars
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  public async sendEvent(event: EventType, data?: EventPayload<EventType>) {
    if (this.sessionId === '') {
      this.sessionId = 'ses_' + crypto.randomUUID();
    }

    const traces = {
      resourceSpans: [
        {
          resource: {
            attributes: [
              { key: 'service.name', value: { stringValue: 'redoc-ce' } },
              { key: 'service.version', value: { stringValue: '0.0.1' } }, // FIXME: add version later
              { key: 'session_id', value: { stringValue: this.sessionId } },
            ],
            droppedAttributesCount: 0,
          },
          scopeSpans: [
            {
              scope: { name: 'client-telemetry' },
              spans: [
                {
                  name: event,
                  traceId: this.randomHex(32),
                  spanId: this.randomHex(16),
                  startTimeUnixNano: (Date.now() * 1000000).toString(),
                  endTimeUnixNano: (Date.now() * 1000000).toString(),
                  status: { code: 0 },
                  links: [],
                  droppedLinksCount: 0,
                  events: [],
                  droppedEventsCount: 0,
                  attributes: [...this.dataToCloudEventData(data)],
                },
              ],
            },
          ],
        },
      ],
    };

    return fetch(OTEL_TRACES_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(traces),
      keepalive: true,
    });
  }

  private dataToCloudEventData(data: EventPayload<EventType>) {
    if (!data) {
      return [];
    }

    return Object.entries(data)
      .map(([key, value]) => {
        const otlpValue = this.toOtlpValue(value);

        if (!otlpValue) {
          return null;
        }

        return {
          key: `cloudevents.event_data.${key}`,
          value: otlpValue,
        };
      })
      .filter((attribute): attribute is { key: string; value: OtlpValue } => attribute !== null);
  }

  private toOtlpValue(value: unknown): OtlpValue | null {
    if (value === undefined) {
      return null;
    }

    if (value === null) {
      return { stringValue: 'null' };
    }

    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return { stringValue: value.toString() };
      }

      return Number.isInteger(value) ? { intValue: value } : { doubleValue: value };
    }

    if (typeof value === 'boolean') {
      return { boolValue: value };
    }

    if (typeof value === 'string') {
      return { stringValue: value };
    }

    if (Array.isArray(value)) {
      const values = value
        .map((item) => this.toOtlpValue(item))
        .filter((item): item is OtlpValue => item !== null);

      return { arrayValue: { values } };
    }

    if (typeof value === 'object') {
      if (Object.prototype.toString.call(value) !== '[object Object]') {
        return { stringValue: String(value) };
      }

      const entries = Object.entries(value as Record<string, unknown>)
        .map(([key, nestedValue]) => {
          const otlpValue = this.toOtlpValue(nestedValue);

          if (!otlpValue) {
            return null;
          }

          return {
            key,
            value: otlpValue,
          };
        })
        .filter((entry): entry is { key: string; value: OtlpValue } => entry !== null);

      return { kvlistValue: { values: entries } };
    }

    return { stringValue: String(value) };
  }
}

export const redocTelemetry = new RedocTelemetry();
