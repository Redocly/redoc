import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter, useLocation } from 'react-router';
import { ClipboardService } from '@redocly/theme/core/openapi';

import type { GlobalStoreAtom } from '../../../jotai/store.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { URL_REPLACE_EVENT } from '../../../hooks/useRouterHashBridge.js';
import { DeepLinkAnchor } from '../DeepLinkAnchor.js';
import type { Node } from '@markdoc/markdoc';
import type { ApiDocsOptions } from '../../../types/options.js';

const TO = '/docs/pets/listpets#pets/listpets/t=field&path=limit';

function LocationState() {
  return <output data-testid="location-state">{JSON.stringify(useLocation().state)}</output>;
}

function renderAnchor() {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
      markdownParser: function (
        _: string,
        __?: Partial<Pick<ApiDocsOptions, 'sanitize' | 'unstable_hooks'>>,
      ): Node | Node[] | undefined {
        throw new Error('Function not implemented.');
      },
    }),
  } as GlobalStoreAtom);

  render(
    <MemoryRouter>
      <JotaiProvider store={store}>
        <DeepLinkAnchor to={TO} label="link to limit" />
        <LocationState />
      </JotaiProvider>
    </MemoryRouter>,
  );
}

/** jsdom has no `PointerEvent`, so `fireEvent.pointerOver` drops `pointerType`. */
function firePointer(type: 'pointerover' | 'pointerout', target: Element, pointerType: string) {
  const event = new MouseEvent(type, { bubbles: true });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  fireEvent(target, event);
}

/** jsdom does not match `:focus-visible` for scripted focus; a keyboard user does. */
function focusWithKeyboard(target: HTMLElement) {
  const matches = Element.prototype.matches;
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
    return selector === ':focus-visible' || matches.call(this, selector);
  });
  act(() => target.focus());
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  window.history.replaceState({}, '', '/');
});

describe('DeepLinkAnchor', () => {
  it('navigates to the deep link without writing to the clipboard', () => {
    const copySpy = vi.spyOn(ClipboardService, 'copyCustom');
    renderAnchor();

    const link = screen.getByRole('link', { name: 'link to limit' });
    fireEvent.click(link);

    expect(copySpy).not.toHaveBeenCalled();
    expect(link.getAttribute('href')).toBe(TO);
    expect(screen.getByTestId('location-state').textContent).toBe('{"smoothScroll":true}');
  });

  it('shows the tooltip at once on keyboard focus and hides it on blur', () => {
    vi.useFakeTimers();
    renderAnchor();
    const link = screen.getByRole('link', { name: 'link to limit' });

    focusWithKeyboard(link);
    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByTestId('deep-link-tooltip').textContent).toBe('Link to this section');

    act(() => link.blur());
    expect(screen.queryByTestId('deep-link-tooltip')).toBeNull();
  });

  it.each([
    [300, 'top'],
    [20, 'bottom'],
  ])('places the tooltip for an icon %ipx from the top: %s', (top, placement) => {
    vi.useFakeTimers();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top,
      bottom: top + 20,
      left: 100,
      width: 20,
    } as DOMRect);
    renderAnchor();

    focusWithKeyboard(screen.getByRole('link', { name: 'link to limit' }));
    act(() => vi.advanceTimersByTime(0));

    expect(screen.getByTestId('deep-link-tooltip').getAttribute('data-placement')).toBe(placement);
  });

  it('hides the tooltip when the page scrolls', () => {
    vi.useFakeTimers();
    renderAnchor();

    focusWithKeyboard(screen.getByRole('link', { name: 'link to limit' }));
    act(() => vi.advanceTimersByTime(0));
    expect(screen.getByTestId('deep-link-tooltip')).toBeTruthy();
    fireEvent.scroll(window);

    expect(screen.queryByTestId('deep-link-tooltip')).toBeNull();
  });

  it('shows the tooltip only after the hover delay, and Escape hides it', () => {
    vi.useFakeTimers();
    renderAnchor();
    const link = screen.getByRole('link', { name: 'link to limit' });

    firePointer('pointerover', link, 'mouse');
    act(() => vi.advanceTimersByTime(400));
    expect(screen.queryByTestId('deep-link-tooltip')).toBeNull();

    act(() => vi.advanceTimersByTime(100));
    expect(screen.getByTestId('deep-link-tooltip').textContent).toBe('Link to this section');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('deep-link-tooltip')).toBeNull();
  });

  it('does not show the tooltip when the pointer leaves before the delay', () => {
    vi.useFakeTimers();
    renderAnchor();
    const link = screen.getByRole('link', { name: 'link to limit' });

    firePointer('pointerover', link, 'mouse');
    firePointer('pointerout', link, 'mouse');
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.queryByTestId('deep-link-tooltip')).toBeNull();
  });

  it('does not show the tooltip for a touch', () => {
    vi.useFakeTimers();
    renderAnchor();

    firePointer('pointerover', screen.getByRole('link', { name: 'link to limit' }), 'touch');
    act(() => vi.advanceTimersByTime(1000));

    expect(screen.queryByTestId('deep-link-tooltip')).toBeNull();
  });

  it('deactivates when scroll-spy silently clears the hash', () => {
    window.history.replaceState({}, '', TO);
    renderAnchor();

    const link = screen.getByRole('link', { name: 'link to limit' });
    expect(link.getAttribute('aria-current')).toBe('location');

    act(() => {
      window.history.replaceState({}, '', '/docs/pets/listpets');
      window.dispatchEvent(new Event(URL_REPLACE_EVENT));
    });

    expect(link.getAttribute('aria-current')).toBeNull();
  });
});
