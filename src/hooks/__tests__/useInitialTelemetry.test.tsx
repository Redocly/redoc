import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { InitialTelemetryContext } from '../../telemetry/initialPayload.js';
import type { RouteIndex, RouteItem } from '../../utils/routing.js';

import { LayoutVariant } from '@redocly/config';

import { TelemetryContext } from '../../contexts/telemetry.js';
import { layoutAtom } from '../../jotai/app.js';
import { useInitialTelemetry } from '../useInitialTelemetry.js';

type MockTelemetry = {
  sendInitialMessage: ReturnType<typeof vi.fn>;
  typeOfUsage?: string;
};

function makeMockTelemetry(typeOfUsage?: string): MockTelemetry {
  return { sendInitialMessage: vi.fn(), typeOfUsage };
}

const root: RouteItem = {
  path: '/',
  label: 'API',
  content: { contentType: 'overview', children: [] },
};
const routeIndex: RouteIndex = {
  allRoutes: [root],
  tagByPath: new Map(),
  itemToParentTag: new Map(),
  routeIndexByPath: new Map([['/', 0]]),
  rootPage: root,
  tags: [],
};

function ProbeComponent({ context }: { context?: InitialTelemetryContext }): null {
  useInitialTelemetry(routeIndex, context);
  return null;
}

function renderWithTelemetry(telemetry: MockTelemetry, context?: InitialTelemetryContext) {
  const store = createStore();
  store.set(layoutAtom, LayoutVariant.STACKED);
  const tree = (
    <JotaiProvider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <TelemetryContext.Provider value={telemetry as never}>
          <ProbeComponent context={context} />
        </TelemetryContext.Provider>
      </MemoryRouter>
    </JotaiProvider>
  );
  return { ...render(tree), tree };
}

describe('useInitialTelemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('describes the load once on mount without the page URL', () => {
    const telemetry = makeMockTelemetry('docker');
    renderWithTelemetry(telemetry, {
      buildTimings: { resolveSpecMs: 120, buildItemsMs: 40 },
      options: { hideDownloadButtons: true },
    });

    expect(telemetry.sendInitialMessage).toHaveBeenCalledTimes(1);
    const payload = telemetry.sendInitialMessage.mock.calls[0][0][0];
    expect(payload).toMatchObject({
      id: 'redocInitial',
      object: 'initial',
      uri: 'urn:redocly:redoc:ui:page',
      layout: LayoutVariant.STACKED,
      typeOfUsage: 'docker',
      landedOn: 'root',
      isLocalhost: true,
      resolveSpecMs: 120,
      buildItemsMs: 40,
      options: { hideDownloadButtons: true },
      operationsCount: 0,
    });
    expect(JSON.stringify(payload)).not.toContain(window.location.origin);
  });

  it('omits typeOfUsage rather than sending undefined when the host reports none', () => {
    const telemetry = makeMockTelemetry(undefined);
    renderWithTelemetry(telemetry);

    const payload = telemetry.sendInitialMessage.mock.calls[0][0][0];
    expect(payload).not.toHaveProperty('typeOfUsage');
  });

  it('does not re-fire when the component re-renders', () => {
    const telemetry = makeMockTelemetry('html');
    const { rerender, tree } = renderWithTelemetry(telemetry);

    rerender(tree);

    expect(telemetry.sendInitialMessage).toHaveBeenCalledTimes(1);
  });
});
