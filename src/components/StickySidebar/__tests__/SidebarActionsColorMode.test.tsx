import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';
import '@testing-library/jest-dom/vitest';

import { SidebarActions } from '../SidebarActions.js';
import { removeCookie } from '../../../utils/cookies.js';

vi.mock('@redocly/theme/components/SidebarActions/SidebarActions', () => ({
  SidebarActions: () => <div data-testid="theme-sidebar-actions" />,
}));

function renderSidebarActions() {
  // A fresh provider per render — the app store re-reads its storage for every store.
  return render(
    <JotaiProvider>
      <SidebarActions />
    </JotaiProvider>,
  );
}

beforeEach(() => {
  document.documentElement.className = '';
  removeCookie('redoc.appStore');
  window.sessionStorage.clear();
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('SidebarActions color mode switcher', () => {
  it('toggles the color mode', () => {
    renderSidebarActions();

    const switcher = screen.getByTestId('color-mode-switcher');
    fireEvent.click(switcher);
    expect(switcher).toHaveAttribute('aria-label', 'dark');

    fireEvent.click(switcher);
    expect(switcher).toHaveAttribute('aria-label', 'light');
    expect(document.documentElement.className).toBe('');
  });

  it('restores the persisted mode on a fresh render', () => {
    renderSidebarActions();
    fireEvent.click(screen.getByTestId('color-mode-switcher'));

    cleanup();
    renderSidebarActions();

    expect(screen.getByTestId('color-mode-switcher')).toHaveAttribute('aria-label', 'dark');
  });

  it('falls back to the OS preference when nothing is stored', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('dark') }));
    renderSidebarActions();

    expect(screen.getByTestId('color-mode-switcher')).toHaveAttribute('aria-label', 'dark');
  });

  it('defaults to light without a stored mode or OS preference', () => {
    renderSidebarActions();

    expect(screen.getByTestId('color-mode-switcher')).toHaveAttribute('aria-label', 'light');
  });
});
