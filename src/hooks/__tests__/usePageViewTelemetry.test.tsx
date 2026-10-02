import { StrictMode } from 'react';
import { render } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import type { RedocTelemetry } from '../../telemetry/RedocTelemetry.js';
import type { RouteIndex, RouteItem } from '../../utils/routing.js';

import { TelemetryContext } from '../../contexts/telemetry.js';
import { getPageUri } from '../../telemetry/page.js';
import { usePageViewTelemetry } from '../usePageViewTelemetry.js';

const root: RouteItem = {
  path: '/',
  label: 'API',
  content: { contentType: 'overview', children: [] },
};
const pets: RouteItem = {
  path: '/pets',
  label: 'Pets',
  content: { contentType: 'item', itemVariant: 'httpItem', children: [] },
};
const routeIndex: RouteIndex = {
  allRoutes: [root, pets],
  tagByPath: new Map(),
  itemToParentTag: new Map(),
  routeIndexByPath: new Map([
    ['/', 0],
    ['/pets', 1],
  ]),
  rootPage: root,
  tags: [],
};

function Probe(): null {
  usePageViewTelemetry(routeIndex);
  return null;
}

function renderAt(pathname: string) {
  const telemetry = { sendViewedMessage: vi.fn() };
  const view = render(
    <JotaiProvider>
      <MemoryRouter initialEntries={[pathname]}>
        <TelemetryContext.Provider value={telemetry as unknown as RedocTelemetry}>
          <Probe />
        </TelemetryContext.Provider>
      </MemoryRouter>
    </JotaiProvider>,
  );
  return { telemetry, view };
}

describe('usePageViewTelemetry', () => {
  it('sends page.viewed once on mount with the route kind and the page URI', () => {
    const { telemetry, view } = renderAt('/pets');
    view.rerender(
      <JotaiProvider>
        <MemoryRouter initialEntries={['/pets']}>
          <TelemetryContext.Provider value={telemetry as unknown as RedocTelemetry}>
            <Probe />
          </TelemetryContext.Provider>
        </MemoryRouter>
      </JotaiProvider>,
    );

    expect(telemetry.sendViewedMessage).toHaveBeenCalledTimes(1);
    const [[[payload]]] = telemetry.sendViewedMessage.mock.calls;
    expect(payload).toMatchObject({
      object: 'page',
      uri: getPageUri(),
      kind: 'operation',
      via: 'load',
    });
  });

  it('sends once when StrictMode re-runs the mount effect', () => {
    const telemetry = { sendViewedMessage: vi.fn() };
    render(
      <StrictMode>
        <JotaiProvider>
          <MemoryRouter initialEntries={['/pets']}>
            <TelemetryContext.Provider value={telemetry as unknown as RedocTelemetry}>
              <Probe />
            </TelemetryContext.Provider>
          </MemoryRouter>
        </JotaiProvider>
      </StrictMode>,
    );

    expect(telemetry.sendViewedMessage).toHaveBeenCalledTimes(1);
    expect(telemetry.sendViewedMessage.mock.calls[0][0][0]).toMatchObject({ via: 'load' });
  });

  it('reports the root page as root', () => {
    const { telemetry } = renderAt('/');
    expect(telemetry.sendViewedMessage.mock.calls[0][0][0]).toMatchObject({ kind: 'root' });
  });
});
