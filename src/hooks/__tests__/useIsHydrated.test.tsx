import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIsHydrated } from '../useIsHydrated.js';

describe('useIsHydrated', () => {
  const frames = new Map<number, FrameRequestCallback>();
  let lastFrameId = 0;

  function runFrame(): void {
    const due = [...frames.values()];
    frames.clear();
    for (const callback of due) callback(0);
  }

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    frames.clear();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.set(++lastFrameId, callback);
      return lastFrameId;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('stays false until the first render has been painted', () => {
    const { result } = renderHook(() => useIsHydrated());
    expect(result.current).toBe(false);

    // The frame callback runs before the paint, so the flip must not happen inside it.
    act(() => runFrame());
    expect(result.current).toBe(false);

    act(() => vi.runAllTimers());
    expect(result.current).toBe(true);
  });

  it('drops the pending frame when unmounted before it runs', () => {
    const { unmount } = renderHook(() => useIsHydrated());
    unmount();

    expect(frames.size).toBe(0);
  });

  it('drops the pending flip when unmounted after the frame ran', () => {
    const { unmount } = renderHook(() => useIsHydrated());
    act(() => runFrame());
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });

  it('flips at once in a hidden document, which paints no frames', () => {
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');

    const { result } = renderHook(() => useIsHydrated());

    expect(result.current).toBe(true);
    expect(frames.size).toBe(0);
  });
});
