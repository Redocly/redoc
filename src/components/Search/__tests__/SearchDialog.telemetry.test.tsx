import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import type { SearchItemData } from '../../../services/search/types.js';

import { SearchSessionContext } from '@redocly/theme/core/openapi';
import { SEARCH_DEBOUNCE_TIME_MS } from '@redocly/theme/core/constants';

import { TelemetryContext } from '../../../contexts/telemetry.js';
import { SearchDialog } from '../SearchDialog.js';

const SESSION_ID = 'session-abc';

function makeResults(count: number): SearchItemData[] {
  return Array.from({ length: count }, (_, i) => ({
    document: { url: `/docs/item-${i}`, title: `Item ${i}`, kind: 'operation' },
    highlight: {},
  })) as unknown as SearchItemData[];
}

type MockTelemetry = {
  sendSearchQueryMessage: ReturnType<typeof vi.fn>;
  sendSearchResultClickedMessage: ReturnType<typeof vi.fn>;
  sendSearchInputResetClickedMessage: ReturnType<typeof vi.fn>;
};

function makeMockTelemetry(): MockTelemetry {
  return {
    sendSearchQueryMessage: vi.fn(),
    sendSearchResultClickedMessage: vi.fn(),
    sendSearchInputResetClickedMessage: vi.fn(),
  };
}

function renderDialog({
  telemetry,
  resultCount = 3,
  isReady = true,
}: {
  telemetry: MockTelemetry;
  resultCount?: number;
  isReady?: boolean;
}) {
  const search = vi.fn(() => makeResults(resultCount));
  render(
    <MemoryRouter>
      <SearchSessionContext.Provider
        value={{ searchSessionId: SESSION_ID, refreshSearchSessionId: () => {} }}
      >
        <TelemetryContext.Provider value={telemetry as never}>
          <SearchDialog onClose={() => {}} search={search} isReady={isReady} />
        </TelemetryContext.Provider>
      </SearchSessionContext.Provider>
    </MemoryRouter>,
  );
  return { search };
}

// The theme's SearchInput/SearchItem declare explicit props, so the `data-testid`s the
// dialog passes them never reach the DOM — query what actually renders instead.
function type(value: string): void {
  fireEvent.change(screen.getByPlaceholderText('Search docs...'), { target: { value } });
}

// The debounce timer starts the search; the settled results land in a microtask.
async function settle(): Promise<void> {
  act(() => void vi.advanceTimersByTime(SEARCH_DEBOUNCE_TIME_MS));
  await act(async () => {});
}

describe('SearchDialog search telemetry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('reports the settled query with its result count, never the query text', async () => {
    const telemetry = makeMockTelemetry();
    renderDialog({ telemetry, resultCount: 3 });

    act(() => type('orders'));
    await settle();

    expect(telemetry.sendSearchQueryMessage).toHaveBeenCalledTimes(1);
    const payload = telemetry.sendSearchQueryMessage.mock.calls[0][0][0];
    expect(payload).toEqual({
      id: 'searchQuery',
      object: 'search',
      uri: 'urn:redocly:redoc:ui:search:searchQuery',
      resultCount: 3,
      wordCount: 1,
      searchSessionId: SESSION_ID,
    });
    expect(JSON.stringify(payload)).not.toContain('orders');
  });

  it('reports a zero result count so empty searches are measurable', async () => {
    const telemetry = makeMockTelemetry();
    renderDialog({ telemetry, resultCount: 0 });

    act(() => type('nothing matches this'));
    await settle();

    expect(telemetry.sendSearchQueryMessage.mock.calls[0][0][0]).toMatchObject({
      resultCount: 0,
      wordCount: 3,
    });
  });

  it('debounces mid-typing so only the settled query is searched', async () => {
    const telemetry = makeMockTelemetry();
    const { search } = renderDialog({ telemetry, resultCount: 2 });

    act(() => type('o'));
    act(() => void vi.advanceTimersByTime(200));
    act(() => type('or'));
    act(() => void vi.advanceTimersByTime(200));
    act(() => type('ord'));

    expect(search).not.toHaveBeenCalled();

    await settle();

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith('ord');
  });

  it('stays silent until the index is ready, so no false zero-result search is recorded', async () => {
    const telemetry = makeMockTelemetry();
    renderDialog({ telemetry, resultCount: 0, isReady: false });

    act(() => type('orders'));
    await settle();

    expect(telemetry.sendSearchQueryMessage).not.toHaveBeenCalled();
  });

  it('counts the same query again after the input was cleared', async () => {
    const telemetry = makeMockTelemetry();
    renderDialog({ telemetry, resultCount: 2 });

    act(() => type('orders'));
    await settle();
    act(() => type(''));
    await settle();
    act(() => type('orders'));
    await settle();

    expect(telemetry.sendSearchQueryMessage).toHaveBeenCalledTimes(2);
  });

  it('tags the result click with the same search session as the query', async () => {
    const telemetry = makeMockTelemetry();
    renderDialog({ telemetry, resultCount: 2 });

    act(() => type('orders'));
    await settle();
    act(() => void fireEvent.click(screen.getAllByRole('link')[0]));

    const payload = telemetry.sendSearchResultClickedMessage.mock.calls[0][0][0];
    expect(payload).toMatchObject({
      searchSessionId: SESSION_ID,
      totalResults: 2,
      index: 0,
      kind: 'operation',
      wordCount: 1,
    });
    expect(payload).not.toHaveProperty('url');
  });
});
