import { act, render } from '@testing-library/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { describe, expect, it, vi } from 'vitest';

import type { RedocTelemetry } from '../../telemetry/RedocTelemetry.js';

import { TelemetryContext } from '../../contexts/telemetry.js';
import { activeScrollSectionAtom } from '../../jotai/app.js';
import { getPageUri } from '../../telemetry/page.js';
import { recordTelemetryEventAtom } from '../../jotai/telemetry.js';
import { useSessionSummaryTelemetry } from '../useSessionSummaryTelemetry.js';

function Probe(): null {
  useSessionSummaryTelemetry();
  return null;
}

function setup() {
  const store = createStore();
  const telemetry = { sendPageTimeMessage: vi.fn(), forceFlush: vi.fn(() => Promise.resolve()) };
  render(
    <JotaiProvider store={store}>
      <TelemetryContext.Provider value={telemetry as unknown as RedocTelemetry}>
        <Probe />
      </TelemetryContext.Provider>
    </JotaiProvider>,
  );
  return { store, telemetry };
}

function setVisibility(state: 'hidden' | 'visible'): void {
  Object.defineProperty(document, 'visibilityState', { value: state, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
}

describe('useSessionSummaryTelemetry', () => {
  it('sends a page.time snapshot when the tab is hidden and flushes it', () => {
    const { telemetry } = setup();

    act(() => setVisibility('hidden'));

    expect(telemetry.sendPageTimeMessage).toHaveBeenCalledTimes(1);
    const [[[payload]]] = telemetry.sendPageTimeMessage.mock.calls;
    expect(payload).toMatchObject({
      object: 'page',
      durationMs: expect.any(Number),
      visibleMs: expect.any(Number),
      sectionsViewed: 0,
      interactions: 0,
      hiddenCount: 1,
      cappedEvents: false,
    });
    expect(payload).not.toHaveProperty('firstInteractionMs');
    expect(telemetry.forceFlush).toHaveBeenCalledTimes(1);
    setVisibility('visible');
  });

  it('sends a cumulative snapshot on every hide that added activity', () => {
    const { store, telemetry } = setup();

    act(() => setVisibility('hidden'));
    act(() => setVisibility('visible'));
    act(() => {
      store.set(recordTelemetryEventAtom, {
        event: 'com.redocly.sidebar.collapsed',
        data: [{ id: 'sidebarCollapse' }],
      });
    });
    act(() => setVisibility('hidden'));

    expect(telemetry.sendPageTimeMessage).toHaveBeenCalledTimes(2);
    expect(telemetry.sendPageTimeMessage.mock.calls[1][0][0]).toMatchObject({
      hiddenCount: 2,
      interactions: 1,
    });
    setVisibility('visible');
  });

  it('skips a hide that added neither visible time nor activity', () => {
    const { telemetry } = setup();

    act(() => setVisibility('hidden'));
    act(() => setVisibility('visible'));
    act(() => setVisibility('hidden'));
    act(() => window.dispatchEvent(new Event('pagehide')));

    expect(telemetry.sendPageTimeMessage).toHaveBeenCalledTimes(1);
    setVisibility('visible');
  });

  it('sends on pagehide only when the tab was still visible', () => {
    const { store, telemetry } = setup();

    act(() => setVisibility('hidden'));
    act(() => window.dispatchEvent(new Event('pagehide')));
    expect(telemetry.sendPageTimeMessage).toHaveBeenCalledTimes(1);

    act(() => setVisibility('visible'));
    act(() => {
      store.set(recordTelemetryEventAtom, {
        event: 'com.redocly.sidebar.collapsed',
        data: [{ id: 'sidebarCollapse' }],
      });
    });
    act(() => window.dispatchEvent(new Event('pagehide')));
    expect(telemetry.sendPageTimeMessage).toHaveBeenCalledTimes(2);
  });

  it('sends one snapshot for the unload sequence pagehide then hidden', () => {
    const { telemetry } = setup();

    act(() => window.dispatchEvent(new Event('pagehide')));
    act(() => setVisibility('hidden'));

    expect(telemetry.sendPageTimeMessage).toHaveBeenCalledTimes(1);
    setVisibility('visible');
  });

  it('sends the summary on unmount when the tab never went hidden', () => {
    const store = createStore();
    const telemetry = { sendPageTimeMessage: vi.fn(), forceFlush: vi.fn(() => Promise.resolve()) };
    const { unmount } = render(
      <JotaiProvider store={store}>
        <TelemetryContext.Provider value={telemetry as unknown as RedocTelemetry}>
          <Probe />
        </TelemetryContext.Provider>
      </JotaiProvider>,
    );

    const mountedUri = getPageUri();
    window.history.pushState({}, '', '/somewhere-else');
    unmount();

    expect(telemetry.sendPageTimeMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendPageTimeMessage.mock.calls[0][0][0]).toMatchObject({
      hiddenCount: 0,
      uri: mountedUri,
    });
  });

  it('counts distinct sections from the scroll spy', () => {
    const { store, telemetry } = setup();

    act(() => {
      store.set(activeScrollSectionAtom, 'section-a');
      store.set(activeScrollSectionAtom, 'section-b');
      store.set(activeScrollSectionAtom, 'section-a');
    });
    act(() => setVisibility('hidden'));

    expect(telemetry.sendPageTimeMessage.mock.calls[0][0][0]).toMatchObject({ sectionsViewed: 2 });
    setVisibility('visible');
  });
});
