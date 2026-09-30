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
  it('toggles the root color mode class', () => {
    renderSidebarActions();

    const switcher = screen.getByTestId('color-mode-switcher');
    fireEvent.click(switcher);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(switcher);
    expect(document.documentElement.classList.contains('light')).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('restores the persisted mode on a fresh render', () => {
    renderSidebarActions();
    fireEvent.click(screen.getByTestId('color-mode-switcher'));
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    cleanup();
    document.documentElement.className = '';

    renderSidebarActions();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('falls back to the OS preference when nothing is stored', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('dark') }));
    renderSidebarActions();

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('defaults to light without a stored mode or OS preference', () => {
    renderSidebarActions();

    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
