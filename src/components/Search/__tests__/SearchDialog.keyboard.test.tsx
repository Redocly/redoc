import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import type { SearchItemData } from '../../../services/search/types.js';

import { SearchSessionContext } from '@redocly/theme/core/openapi';

import { TelemetryContext } from '../../../contexts/telemetry.js';
import { SearchDialog } from '../SearchDialog.js';

function makeResults(count: number): SearchItemData[] {
  return Array.from({ length: count }, (_, i) => ({
    document: { url: `/docs/item-${i}`, title: `Item ${i}` },
    highlight: {},
  })) as unknown as SearchItemData[];
}

const telemetry = {
  sendSearchQueryMessage: vi.fn(),
  sendSearchResultClickedMessage: vi.fn(),
  sendSearchInputResetClickedMessage: vi.fn(),
};

function renderDialog(resultCount: number) {
  render(
    <MemoryRouter>
      <SearchSessionContext.Provider
        value={{ searchSessionId: 'session-abc', refreshSearchSessionId: () => {} }}
      >
        <TelemetryContext.Provider value={telemetry as never}>
          <SearchDialog onClose={() => {}} search={() => makeResults(resultCount)} isReady />
        </TelemetryContext.Provider>
      </SearchSessionContext.Provider>
    </MemoryRouter>,
  );
}

function input(): HTMLElement {
  return screen.getByPlaceholderText('Search docs...');
}

function arrow(key: 'ArrowDown' | 'ArrowUp'): void {
  fireEvent.keyDown(screen.getByTestId('search-dialog'), { key });
}

function focusedTitle(): string | null | undefined {
  return document.activeElement?.textContent;
}

afterEach(() => {
  cleanup();
});

describe('SearchDialog keyboard navigation', () => {
  it('walks the results with the arrow keys and returns to the input', async () => {
    renderDialog(3);
    fireEvent.change(input(), { target: { value: 'item' } });
    await waitFor(() => expect(screen.getByText('Item 0')).toBeDefined());

    arrow('ArrowDown');
    await waitFor(() => expect(focusedTitle()).toContain('Item 0'));

    arrow('ArrowDown');
    await waitFor(() => expect(focusedTitle()).toContain('Item 1'));

    arrow('ArrowUp');
    await waitFor(() => expect(focusedTitle()).toContain('Item 0'));

    arrow('ArrowUp');
    await waitFor(() => expect(document.activeElement).toBe(input()));
  });

  it('stops at the last result instead of wrapping', async () => {
    renderDialog(2);
    fireEvent.change(input(), { target: { value: 'item' } });
    await waitFor(() => expect(screen.getByText('Item 1')).toBeDefined());

    arrow('ArrowDown');
    arrow('ArrowDown');
    arrow('ArrowDown');

    await waitFor(() => expect(focusedTitle()).toContain('Item 1'));
  });

  it('drops the selection when the query changes', async () => {
    renderDialog(3);
    fireEvent.change(input(), { target: { value: 'item' } });
    await waitFor(() => expect(screen.getByText('Item 0')).toBeDefined());

    arrow('ArrowDown');
    await waitFor(() => expect(focusedTitle()).toContain('Item 0'));

    fireEvent.change(input(), { target: { value: 'other' } });
    arrow('ArrowDown');
    expect(document.activeElement).toBe(input());

    await waitFor(() => expect(screen.getByText('Item 0')).toBeDefined());
    expect(document.activeElement).toBe(input());

    arrow('ArrowDown');
    await waitFor(() => expect(focusedTitle()).toContain('Item 0'));
  });
});
