import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router';
import { Provider, createStore } from 'jotai';
import { act } from 'react';

import { visitedChannelsAtom } from '../../jotai/app.js';
import { useVisitedChannelsTracker } from '../useVisitedChannelsTracker.js';

let navigateFn: ((to: string) => void) | undefined;

function Tracker(): null {
  useVisitedChannelsTracker();
  navigateFn = useNavigate();
  return null;
}

function renderTracker(store: ReturnType<typeof createStore>, initialPath: string): void {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="*" element={<Tracker />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('useVisitedChannelsTracker', () => {
  it('records the initial pathname lowercased', () => {
    const store = createStore();
    renderTracker(store, '/Docs/Channels/User-Queue');

    expect(store.get(visitedChannelsAtom)).toEqual(['/docs/channels/user-queue']);
  });

  it('appends newly navigated pathnames without duplicating revisited ones', () => {
    const store = createStore();
    renderTracker(store, '/docs/a');

    act(() => navigateFn?.('/docs/b'));
    act(() => navigateFn?.('/docs/a'));

    expect(store.get(visitedChannelsAtom)).toEqual(['/docs/a', '/docs/b']);
  });

  it('does not record a new entry on hash-only changes', () => {
    const store = createStore();
    renderTracker(store, '/docs/a');

    act(() => navigateFn?.('/docs/a#section-2'));

    expect(store.get(visitedChannelsAtom)).toEqual(['/docs/a']);
  });
});
