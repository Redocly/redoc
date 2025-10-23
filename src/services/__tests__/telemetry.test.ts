import type { EventType } from '@redocly/redoc-opentelemetry';

describe('RedocTelemetry', () => {
  const mockFetch = jest.fn();
  const mockRandomUUID = jest.fn();
  const mockGetRandomValues = jest.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
    Object.defineProperty(global.crypto, 'randomUUID', {
      value: mockRandomUUID,
      writable: true,
    });
    Object.defineProperty(global.crypto, 'getRandomValues', {
      value: mockGetRandomValues,
      writable: true,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // A new instance is needed to clear session ID for each test
    jest.resetModules();
  });

  it('should send an event with the correct structure', async () => {
    mockRandomUUID.mockReturnValue('test-session-uuid');
    mockGetRandomValues.mockImplementation((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = i;
      }
      return arr;
    });

    const { redocTelemetry: redocTelemetryInstance } = await import('../telemetry');

    await redocTelemetryInstance.sendEvent(
      'event_name' as EventType,
      {
        stringValue: 'test',
        numberValue: 123,
        booleanValue: true,
        objectValue: { key: 'value' },
        nullValue: null,
      } as any,
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCall = mockFetch.mock.calls[0];
    expect(fetchCall[0]).toBe('https://otel.cloud.redocly.com/v1/traces');
    expect(fetchCall[1].method).toBe('POST');
    expect(fetchCall[1].headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(fetchCall[1].body);
    const span = body.resourceSpans[0].scopeSpans[0].spans[0];

    expect(span.name).toBe('event_name');

    const spanAttributes = span.attributes;
    expect(spanAttributes).toContainEqual({
      key: 'cloudevents.event_data.stringValue',
      value: { stringValue: 'test' },
    });
    expect(spanAttributes).toContainEqual({
      key: 'cloudevents.event_data.numberValue',
      value: { intValue: 123 },
    });
    expect(spanAttributes).toContainEqual({
      key: 'cloudevents.event_data.booleanValue',
      value: { booleanValue: 'true' },
    });
    expect(spanAttributes).toContainEqual({
      key: 'cloudevents.event_data.objectValue',
      value: { objValue: '{"key":"value"}' },
    });
    expect(spanAttributes).toContainEqual({
      key: 'cloudevents.event_data.nullValue',
      value: { objValue: 'null' },
    });

    const resourceAttributes = body.resourceSpans[0].resource.attributes;
    expect(resourceAttributes).toContainEqual({
      key: 'session_id',
      value: { stringValue: 'ses_test-session-uuid' },
    });
  });

  it('should generate and reuse session ID', async () => {
    mockRandomUUID.mockReturnValueOnce('first-uuid').mockReturnValueOnce('second-uuid');

    // a new instance of RedocTelemetry to have clear state
    const { redocTelemetry: redocTelemetryInstance } = await import('../telemetry');

    await redocTelemetryInstance.sendEvent('first_event' as EventType);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const firstBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    const firstSessionId = firstBody.resourceSpans[0].resource.attributes.find(
      (attr) => attr.key === 'session_id',
    ).value.stringValue;
    expect(firstSessionId).toBe('ses_first-uuid');

    await redocTelemetryInstance.sendEvent('second_event' as EventType);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    const secondBody = JSON.parse(mockFetch.mock.calls[1][1].body);
    const secondSessionId = secondBody.resourceSpans[0].resource.attributes.find(
      (attr) => attr.key === 'session_id',
    ).value.stringValue;
    expect(secondSessionId).toBe('ses_first-uuid');
  });
});
