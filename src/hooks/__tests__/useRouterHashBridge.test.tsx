import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';

import type { NavigateFunction } from 'react-router';

import { URL_REPLACE_EVENT, useRouterHashBridge } from '../useRouterHashBridge.js';
import { useUrlHashReassert } from '../useUrlHashReassert.js';

let navigate: NavigateFunction;
let reassertToken: number;

function Bridge(): null {
  useRouterHashBridge();
  reassertToken = useUrlHashReassert();
  navigate = useNavigate();
  return null;
}

function renderBridge(initialEntry: string) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Bridge />
    </MemoryRouter>,
  );
}

describe('useRouterHashBridge', () => {
  let onHashChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    onHashChange = vi.fn();
    window.addEventListener('hashchange', onHashChange);
  });

  afterEach(() => {
    window.removeEventListener('hashchange', onHashChange);
  });

  it('dispatches a synthetic hashchange when router navigation changes the hash', () => {
    renderBridge('/docs');

    act(() => navigate('/docs#section/foo'));

    expect(onHashChange).toHaveBeenCalledTimes(1);
  });

  it('does not dispatch on mount', () => {
    renderBridge('/docs#section/foo');

    expect(onHashChange).not.toHaveBeenCalled();
  });

  it('does not dispatch when navigation keeps the hash unchanged', () => {
    renderBridge('/docs#section/foo');

    act(() => navigate('/docs/other#section/foo'));

    expect(onHashChange).not.toHaveBeenCalled();
  });

  it('dispatches when navigation clears the hash', () => {
    renderBridge('/docs#section/foo');

    act(() => navigate('/docs/other'));

    expect(onHashChange).toHaveBeenCalledTimes(1);
  });

  it('dispatches once per hash change across successive navigations', () => {
    renderBridge('/docs');

    act(() => navigate('/docs#a'));
    act(() => navigate('/docs#b'));

    expect(onHashChange).toHaveBeenCalledTimes(2);
  });

  it('does not double-dispatch when the hash change came from a real hashchange event', () => {
    renderBridge('/docs');

    // A real (browser-initiated) hash navigation: the URL is already updated
    // and the native hashchange event has fired before the router re-renders.
    window.history.replaceState({}, '', '#section/foo');
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(onHashChange).toHaveBeenCalledTimes(1);

    // Router catches up with the same hash (as it does on popstate) — the
    // bridge must stay silent instead of re-dispatching.
    act(() => navigate('/docs#section/foo'));

    expect(onHashChange).toHaveBeenCalledTimes(1);
  });

  it('re-dispatches when navigating back to the router hash after a silent scroll-spy rewrite', () => {
    renderBridge('/docs');

    act(() => navigate('/docs#section/foo'));
    expect(onHashChange).toHaveBeenCalledTimes(1);

    // Scroll-spy rewrites the URL via raw replaceState (dropping the hash) and
    // announces it with URL_REPLACE_EVENT; subscribers are not notified.
    window.history.replaceState({}, '', '/docs/other-section');
    act(() => {
      window.dispatchEvent(new Event(URL_REPLACE_EVENT));
    });
    expect(onHashChange).toHaveBeenCalledTimes(1);

    // A link back to the router's remembered hash changes window.location.hash
    // again, so consumers must be re-notified.
    act(() => navigate('/docs#section/foo'));
    expect(onHashChange).toHaveBeenCalledTimes(2);
  });

  it('announces a reassert when navigating to the hash the page already sits at', () => {
    renderBridge('/docs#section/foo');
    const before = reassertToken;

    // Re-opening the search result for the spot the reader is already at: the hash string
    // cannot change, so hash-driven state only re-applies if the bridge announces it.
    act(() => navigate('/docs#section/foo'));

    expect(onHashChange).not.toHaveBeenCalled();
    expect(reassertToken).not.toBe(before);
  });

  it('does not announce a reassert on mount or when the hash itself changes', () => {
    renderBridge('/docs#section/foo');
    const onMount = reassertToken;

    act(() => navigate('/docs#section/bar'));

    expect(onHashChange).toHaveBeenCalledTimes(1);
    expect(reassertToken).toBe(onMount);
  });

  it('does not double-dispatch when the hash change came from a popstate event', () => {
    renderBridge('/docs');

    window.history.replaceState({}, '', '#section/bar');
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(onHashChange).not.toHaveBeenCalled();

    act(() => navigate('/docs#section/bar'));

    expect(onHashChange).not.toHaveBeenCalled();
  });

  it('announces a reassert on a synthetic hashchange that leaves the hash unchanged', () => {
    window.history.replaceState({}, '', '/docs#section/foo');
    renderBridge('/docs#section/foo');
    const before = reassertToken;

    // A host that re-lands on the current URL without routing (the portal skips the router
    // when nothing in the URL changed) signals it with a hashchange the browser never fires.
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(reassertToken).not.toBe(before);
  });

  it('announces a reassert under the hash router, where the window fragment also carries the route', () => {
    // Redoc standalone: window shows `#/docs#section/foo`, the router sees `/docs` + `#section/foo`.
    window.history.replaceState({}, '', '/#/docs#section/foo');
    renderBridge('/docs#section/foo');
    // A real hash navigation synced the bridge from the window form of the fragment.
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    const before = reassertToken;
    onHashChange.mockClear();

    act(() => navigate('/docs#section/foo'));

    expect(onHashChange).not.toHaveBeenCalled();
    expect(reassertToken).not.toBe(before);
  });
});
