import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';

import type { ReactNode } from 'react';

import { TelemetryContext } from '../../contexts/telemetry.js';
import { getPageUri } from '../../telemetry/page.js';
import { usePerformanceMetricsTelemetry } from '../usePerformanceMetricsTelemetry.js';

const { onCLS, onLCP, onFCP, onTTFB, onINP } = vi.hoisted(() => ({
  onCLS: vi.fn(),
  onLCP: vi.fn(),
  onFCP: vi.fn(),
  onTTFB: vi.fn(),
  onINP: vi.fn(),
}));

vi.mock('web-vitals', () => ({ onCLS, onLCP, onFCP, onTTFB, onINP }));

type MockTelemetry = {
  sendPerformanceMetricsMessage: ReturnType<typeof vi.fn>;
  forceFlush: ReturnType<typeof vi.fn>;
};

function makeMockTelemetry(): MockTelemetry {
  return {
    sendPerformanceMetricsMessage: vi.fn(),
    forceFlush: vi.fn(() => Promise.resolve()),
  };
}

function ProbeComponent(): null {
  usePerformanceMetricsTelemetry();
  return null;
}

function renderWithTelemetry(telemetry: MockTelemetry): ReactNode {
  return render(
    <JotaiProvider>
      <TelemetryContext.Provider value={telemetry as never}>
        <ProbeComponent />
      </TelemetryContext.Provider>
    </JotaiProvider>,
  );
}

type VitalCallback = (m: { value: number }) => void;
const lastCallback = (mock: ReturnType<typeof vi.fn>): VitalCallback =>
  mock.mock.calls.at(-1)?.[0] as VitalCallback;

function reportAllVitals(): void {
  lastCallback(onCLS)({ value: 0.1 });
  lastCallback(onLCP)({ value: 1200 });
  lastCallback(onFCP)({ value: 800 });
  lastCallback(onTTFB)({ value: 50 });
}

function hideTab(): void {
  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
  act(() => {
    document.dispatchEvent(new Event('visibilitychange'));
  });
}

describe('usePerformanceMetricsTelemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
  });

  it('subscribes to web-vitals on mount, including INP', () => {
    renderWithTelemetry(makeMockTelemetry());

    expect(onCLS).toHaveBeenCalledTimes(1);
    expect(onLCP).toHaveBeenCalledTimes(1);
    expect(onFCP).toHaveBeenCalledTimes(1);
    expect(onTTFB).toHaveBeenCalledTimes(1);
    expect(onINP).toHaveBeenCalledTimes(1);
  });

  it('does NOT send performance metrics before the tab is hidden, even with all vitals', () => {
    const telemetry = makeMockTelemetry();
    renderWithTelemetry(telemetry);

    reportAllVitals();

    expect(telemetry.sendPerformanceMetricsMessage).not.toHaveBeenCalled();
  });

  it('does NOT send on hide until all four vitals arrived', () => {
    const telemetry = makeMockTelemetry();
    renderWithTelemetry(telemetry);

    lastCallback(onCLS)({ value: 0.1 });
    lastCallback(onLCP)({ value: 1200 });
    hideTab();

    expect(telemetry.sendPerformanceMetricsMessage).not.toHaveBeenCalled();
  });

  it('sends once on hide with INP when it has been reported, then flushes', () => {
    const telemetry = makeMockTelemetry();
    renderWithTelemetry(telemetry);

    reportAllVitals();
    lastCallback(onINP)({ value: 180 });
    hideTab();

    expect(telemetry.sendPerformanceMetricsMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendPerformanceMetricsMessage.mock.calls[0][0][0]).toMatchObject({
      id: 'metrics',
      object: 'metrics',
      uri: getPageUri(),
      cls: 0.1,
      lcp: 1200,
      fcp: 800,
      ttfb: 50,
      inp: 180,
    });
    expect(telemetry.forceFlush).toHaveBeenCalledTimes(1);

    lastCallback(onTTFB)({ value: 60 });
    hideTab();
    expect(telemetry.sendPerformanceMetricsMessage).toHaveBeenCalledTimes(1);
  });

  it('sends when the fourth vital arrives after the tab was hidden', () => {
    const telemetry = makeMockTelemetry();
    renderWithTelemetry(telemetry);

    lastCallback(onCLS)({ value: 0.1 });
    lastCallback(onLCP)({ value: 1200 });
    lastCallback(onFCP)({ value: 800 });
    hideTab();
    lastCallback(onTTFB)({ value: 50 });

    expect(telemetry.sendPerformanceMetricsMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendPerformanceMetricsMessage.mock.calls[0][0][0]).not.toHaveProperty('inp');
  });
});
