const OTEL_TRACES_URL = 'https://otel.cloud.redocly.com/v1/traces'; // Prod: 'https://otel.cloud.redocly.com/v1/traces';

import type { EventType, EventPayload } from '@redocly/redoc-opentelemetry';

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
    const cloudEventData = Object.entries(data || {}).map(([key, value]) => {
      switch (typeof value) {
        case 'number':
          return {
            key: `cloudevents.event_data.${key}`,
            value: { intValue: value },
          };
        case 'object':
          return {
            key: `cloudevents.event_data.${key}`,
            value: { objValue: JSON.stringify(value) },
          };
        case 'string':
          return {
            key: `cloudevents.event_data.${key}`,
            value: { stringValue: value.toString() },
          };
        case 'boolean':
          return {
            key: `cloudevents.event_data.${key}`,
            value: { booleanValue: value.toString() },
          };
        default:
          return {
            key: `cloudevents.event_data.${key}`,
            value: { stringValue: value ? value.toString() : 'unknown_value' },
          };
      }
    });

    return cloudEventData;
  }
}

export const redocTelemetry = new RedocTelemetry();
