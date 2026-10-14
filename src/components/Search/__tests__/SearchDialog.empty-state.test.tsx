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

function renderDialog(search: (query: string) => SearchItemData[]) {
  render(
    <MemoryRouter>
      <SearchSessionContext.Provider
        value={{ searchSessionId: 'session-abc', refreshSearchSessionId: () => {} }}
      >
        <TelemetryContext.Provider value={telemetry as never}>
          <SearchDialog onClose={() => {}} search={search} isReady />
        </TelemetryContext.Provider>
      </SearchSessionContext.Provider>
    </MemoryRouter>,
  );
}

/** The theme's SearchInput declares explicit props, so its `data-testid` never reaches the DOM. */
function type(value: string): void {
  fireEvent.change(screen.getByPlaceholderText('Search docs...'), { target: { value } });
}

afterEach(() => {
  cleanup();
});

describe('SearchDialog empty states', () => {
  it('prompts for a query before anything is typed', () => {
    renderDialog(() => makeResults(2));

    expect(screen.getByText(/Search endpoints, schemas, and more/)).toBeDefined();
    expect(screen.queryByText('No results')).toBeNull();
  });

  it('replaces the prompt with results once a term matches', async () => {
    renderDialog(() => makeResults(2));

    type('menu');

    // The query is debounced, so results land a tick after the keystroke.
    await waitFor(() => expect(screen.getByText('Item 0')).toBeDefined());
    expect(screen.queryByText(/Search endpoints, schemas, and more/)).toBeNull();
    expect(screen.queryByText('No results')).toBeNull();
  });

  it('reports no results for a term the index does not contain', async () => {
    renderDialog(() => []);

    type('zzz-nothing-matches-this');

    // Until the debounced search resolves the dialog says it is searching, not that nothing matched.
    expect(screen.getByText('Searching...')).toBeDefined();
    expect(screen.queryByText('No results')).toBeNull();

    await waitFor(() => expect(screen.getByText('No results')).toBeDefined());
    expect(screen.queryByText(/Search endpoints, schemas, and more/)).toBeNull();
  });
});
