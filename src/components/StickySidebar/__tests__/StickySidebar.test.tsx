import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore, Provider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import { isSidebarOpenedAtom } from '../../../jotai/app.js';
import { StickySidebar } from '../StickySidebar.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../__tests__/themeHooksMock.js')).themeHooksMock(),
}));

type MediaQueryStub = {
  matches: boolean;
  listeners: Set<() => void>;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
};

let mediaQuery: MediaQueryStub;

beforeEach(() => {
  mediaQuery = {
    matches: false,
    listeners: new Set(),
    addEventListener: (_type, listener) => mediaQuery.listeners.add(listener),
    removeEventListener: (_type, listener) => mediaQuery.listeners.delete(listener),
  };
  vi.stubGlobal('matchMedia', () => mediaQuery);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderSidebar(opts: { open: boolean; collapsedSidebar?: boolean }) {
  const store = createStore();
  store.set(isSidebarOpenedAtom, opts.open);
  render(
    <Provider store={store}>
      <StickySidebar collapsedSidebar={opts.collapsedSidebar}>
        <div data-component-name="Menu/MenuItem" className="menu-item-type-page">
          <a href="#/page" data-testid="leaf-link">
            Page
          </a>
        </div>
        <div data-component-name="Menu/MenuItem" className="menu-item-type-group">
          <a href="#/group" data-testid="group-link">
            Group
          </a>
        </div>
        <div data-component-name="Menu/MenuItem" className="menu-item-type-drilldown">
          <a href="#/drill" data-testid="drilldown-link">
            Drilldown
          </a>
        </div>
      </StickySidebar>
    </Provider>,
  );
  return store;
}

describe('StickySidebar mobile drawer', () => {
  it('closes after a click on a leaf menu link', () => {
    const store = renderSidebar({ open: true });

    fireEvent.click(screen.getByTestId('leaf-link'));

    expect(store.get(isSidebarOpenedAtom)).toBe(false);
  });

  it.each(['group-link', 'drilldown-link'])('stays open after a click on %s', (testId) => {
    const store = renderSidebar({ open: true });

    fireEvent.click(screen.getByTestId(testId));

    expect(store.get(isSidebarOpenedAtom)).toBe(true);
  });

  it('closes when the viewport becomes desktop-sized', () => {
    const store = renderSidebar({ open: true });
    expect(store.get(isSidebarOpenedAtom)).toBe(true);

    act(() => {
      mediaQuery.matches = true;
      mediaQuery.listeners.forEach((listener) => listener());
    });

    expect(store.get(isSidebarOpenedAtom)).toBe(false);
  });

  it('hides the menu while a collapsed sidebar is closed and shows it when opened', () => {
    const closed = renderSidebar({ open: false, collapsedSidebar: true });
    expect(screen.queryByTestId('leaf-link')).not.toBeInTheDocument();

    act(() => closed.set(isSidebarOpenedAtom, true));

    expect(screen.getByTestId('leaf-link')).toBeInTheDocument();
  });

  it('toggles the drawer from the floating button', () => {
    const store = renderSidebar({ open: false });

    fireEvent.click(screen.getByTestId('floating-button'));
    expect(store.get(isSidebarOpenedAtom)).toBe(true);

    fireEvent.click(screen.getByTestId('floating-button'));
    expect(store.get(isSidebarOpenedAtom)).toBe(false);
  });
});
