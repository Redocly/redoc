import { describe, expect, it } from 'vitest';

import { isTelemetryDisabled } from '../RedocStandalone.js';

describe('disableTelemetry option', () => {
  it('opts out only with the literal true', () => {
    expect(isTelemetryDisabled(true)).toBe(true);
    expect(isTelemetryDisabled('true')).toBe(true);
  });

  it('keeps telemetry on for a bare attribute, false, or no value', () => {
    expect(isTelemetryDisabled('')).toBe(false);
    expect(isTelemetryDisabled('false')).toBe(false);
    expect(isTelemetryDisabled(false)).toBe(false);
    expect(isTelemetryDisabled(undefined)).toBe(false);
  });
});
