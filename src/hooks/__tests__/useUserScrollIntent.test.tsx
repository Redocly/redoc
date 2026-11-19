import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useUserScrollIntent } from '../useUserScrollIntent.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return { ...actual, IS_BROWSER: true };
});

/** The first history entry: no key in `history.state`, `location.key` is `default`. */
function renderIntent() {
  return renderHook(() => useUserScrollIntent('default')).result;
}

function dispatch(target: EventTarget, event: Event): void {
  act(() => {
    target.dispatchEvent(event);
  });
}

let scrollY = 0;
Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scrollY });

/** The scroll event the browser dispatches in the next rendering update, with the page
 *  moved by `by` px (0: a scroll event that moved nothing). */
function scroll(by = 100): void {
  scrollY += by;
  dispatch(window, new Event('scroll'));
}

/** A gesture that moves the page: the gesture event, then the scroll it causes. */
function gesture(event: Event, target: EventTarget = window): void {
  dispatch(target, event);
  scroll();
}

const frames = (count: number): Promise<void> =>
  new Promise((resolve) => {
    const next = (left: number): void => {
      if (left === 0) resolve();
      else requestAnimationFrame(() => next(left - 1));
    };
    next(count);
  });

describe('useUserScrollIntent', () => {
  afterEach(() => {
    window.history.replaceState(null, '');
  });

  it.each([
    ['wheel', (): Event => new Event('wheel')],
    ['touchmove', (): Event => new Event('touchmove')],
    ['scroll-key keydown', (): Event => new KeyboardEvent('keydown', { key: 'PageDown' })],
  ])('opens when the page scrolls after a %s', (_name, makeEvent) => {
    const result = renderIntent();
    gesture(makeEvent());
    expect(result.current).toBe(true);
  });

  it('stays closed after a gesture that does not move the page', () => {
    // A wheel tick at the end of the page, Space typed into a search field.
    const result = renderIntent();
    dispatch(window, new Event('wheel'));
    dispatch(window, new KeyboardEvent('keydown', { key: ' ' }));
    expect(result.current).toBe(false);
  });

  it('stays closed on a scroll event that moved nothing', () => {
    const result = renderIntent();
    dispatch(window, new Event('wheel'));
    scroll(0);
    expect(result.current).toBe(false);
  });

  it('opens when the wheel event runs after the compositor already scrolled to the edge', () => {
    // Passive listener: the page is at the bottom by the time the wheel reaches the main
    // thread, and the scroll event follows in the next rendering update.
    const result = renderIntent();
    scrollY += 600;
    dispatch(window, new WheelEvent('wheel', { deltaY: 4000 }));
    dispatch(window, new Event('scroll'));
    expect(result.current).toBe(true);
  });

  it('stays closed on a scroll more than two frames after a wheel that moved nothing', async () => {
    // Lazy content reflowing under a reader who wheeled at the end of the page.
    const result = renderIntent();
    dispatch(window, new WheelEvent('wheel', { deltaY: 100 }));
    await frames(3);
    scroll();
    expect(result.current).toBe(false);
  });

  it('stays closed on a scroll no gesture preceded (programmatic settle)', () => {
    const result = renderIntent();
    dispatch(window, new Event('scroll'));
    expect(result.current).toBe(false);
  });

  it('ignores typing (non-scroll keydown)', () => {
    const result = renderIntent();
    gesture(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(result.current).toBe(false);
  });

  it('ignores content clicks (mousedown below <html>)', () => {
    const result = renderIntent();
    gesture(new MouseEvent('mousedown', { bubbles: true }), document.body);
    expect(result.current).toBe(false);
  });

  it('opens on a scrollbar drag (mousedown targets <html>)', () => {
    const result = renderIntent();
    gesture(new MouseEvent('mousedown', { bubbles: true }), document.documentElement);
    expect(result.current).toBe(true);
  });

  it('opens on a scrollbar drag that starts moving more than two frames after the press', async () => {
    const result = renderIntent();
    dispatch(document.documentElement, new MouseEvent('mousedown', { bubbles: true }));
    await frames(3);
    scroll();
    expect(result.current).toBe(true);
  });

  it('stays closed on a scroll more than two frames after the scrollbar is released', async () => {
    const result = renderIntent();
    dispatch(document.documentElement, new MouseEvent('mousedown', { bubbles: true }));
    dispatch(document.documentElement, new MouseEvent('mouseup', { bubbles: true }));
    await frames(3);
    scroll();
    expect(result.current).toBe(false);
  });

  it('re-renders the caller on the scroll, not inside the gesture handler', () => {
    const renders = vi.fn();
    const { result } = renderHook(() => {
      renders();
      return useUserScrollIntent('default');
    });
    const before = renders.mock.calls.length;
    dispatch(window, new KeyboardEvent('keydown', { key: 'PageDown' }));
    expect(renders.mock.calls.length).toBe(before);

    scroll();
    expect(result.current).toBe(true);
    expect(renders.mock.calls.length).toBeGreaterThan(before);
  });

  it('drops a gesture that lands after pushState but before the new location commits', () => {
    // React Router writes the next key to history.state in the click; the render that
    // carries the new location.key commits later.
    const { result, rerender } = renderHook(({ resetKey }) => useUserScrollIntent(resetKey), {
      initialProps: { resetKey: 'a' },
    });
    window.history.replaceState({ key: 'b' }, '');
    try {
      gesture(new Event('wheel'));
      expect(result.current).toBe(false);

      rerender({ resetKey: 'b' });
      expect(result.current).toBe(false);

      gesture(new Event('wheel'));
      expect(result.current).toBe(true);
    } finally {
      window.history.replaceState(null, '');
    }
  });

  it('drops a scroll after Back to an entry whose key differs', () => {
    window.history.replaceState({ key: 'a' }, '');
    const result = renderHook(() => useUserScrollIntent('b')).result;
    gesture(new Event('wheel'));
    expect(result.current).toBe(false);
  });

  it('drops a scroll after Back to the first entry, which has no key', () => {
    window.history.replaceState({ idx: 0 }, '');
    const { result, rerender } = renderHook(({ resetKey }) => useUserScrollIntent(resetKey), {
      initialProps: { resetKey: 'b' },
    });
    gesture(new Event('wheel'));
    expect(result.current).toBe(false);

    rerender({ resetKey: 'default' });
    gesture(new Event('wheel'));
    expect(result.current).toBe(true);
  });

  it('closes when resetKey changes', () => {
    window.history.replaceState({ key: 'a' }, '');
    const { result, rerender } = renderHook(({ resetKey }) => useUserScrollIntent(resetKey), {
      initialProps: { resetKey: 'a' },
    });
    gesture(new Event('wheel'));
    expect(result.current).toBe(true);

    rerender({ resetKey: 'b' });
    expect(result.current).toBe(false);
  });

  it('closes again when a key repeats (Back to the first entry restores its key)', () => {
    const { result, rerender } = renderHook(({ resetKey }) => useUserScrollIntent(resetKey), {
      initialProps: { resetKey: 'default' },
    });
    gesture(new Event('wheel'));
    expect(result.current).toBe(true);

    rerender({ resetKey: 'pushed' });
    rerender({ resetKey: 'default' });
    expect(result.current).toBe(false);

    dispatch(window, new Event('scroll'));
    expect(result.current).toBe(false);
  });
});
