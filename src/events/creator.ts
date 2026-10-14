import type { AnalyticsEvent, AnalyticsEventType } from '../types/events.js';

// TODO: Extract
export function createTrackingEvent<T extends AnalyticsEvent>(
  eventType: AnalyticsEventType,
): (payload: Omit<T, 'eventType'>) => T {
  return (payload: Omit<T, 'eventType'>) => ({ ...payload, eventType }) as T;
}
