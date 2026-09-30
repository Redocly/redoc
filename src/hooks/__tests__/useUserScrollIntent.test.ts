import { describe, expect, it } from 'vitest';

import { createScrollIntentTracker } from '../useUserScrollIntent.js';

function wheel(deltaY: number, deltaMode = 0): WheelEvent {
  return new WheelEvent('wheel', { deltaY, deltaMode });
}

function wheelAt(deltaY: number, timeStamp: number): WheelEvent {
  return { type: 'wheel', deltaY, deltaMode: 0, timeStamp } as unknown as WheelEvent;
}

describe('createScrollIntentTracker', () => {
  it('does not treat trackpad micro-wheel noise as intent', () => {
    const isIntent = createScrollIntentTracker();
    // 10 ticks of 2px — resting fingers on a trackpad during page load.
    for (let i = 0; i < 10; i++) {
      expect(isIntent(wheel(2))).toBe(false);
    }
  });

  it('flips once cumulative wheel distance crosses the threshold', () => {
    const isIntent = createScrollIntentTracker();
    expect(isIntent(wheel(20))).toBe(false);
    expect(isIntent(wheel(20))).toBe(false);
    expect(isIntent(wheel(20))).toBe(true);
  });

  it('resets the accumulator after an idle gap so sporadic noise never sums to intent', () => {
    const isIntent = createScrollIntentTracker();
    // Two ticks close in time accumulate (40px, below threshold)...
    expect(isIntent(wheelAt(20, 1000))).toBe(false);
    expect(isIntent(wheelAt(20, 1100))).toBe(false);
    // ...but a tick after a long idle gap starts fresh instead of crossing 48px.
    expect(isIntent(wheelAt(20, 5000))).toBe(false);
  });

  it('still accumulates ticks within a contiguous gesture', () => {
    const isIntent = createScrollIntentTracker();
    expect(isIntent(wheelAt(20, 1000))).toBe(false);
    expect(isIntent(wheelAt(20, 1050))).toBe(false);
    expect(isIntent(wheelAt(20, 1100))).toBe(true);
  });

  it('treats a single mouse-wheel notch as intent', () => {
    const isIntent = createScrollIntentTracker();
    expect(isIntent(wheel(100))).toBe(true);
  });

  it('accumulates absolute distance regardless of direction', () => {
    const isIntent = createScrollIntentTracker();
    expect(isIntent(wheel(-30))).toBe(false);
    expect(isIntent(wheel(30))).toBe(true);
  });

  it('treats a line-mode wheel notch (Firefox) as intent', () => {
    const isIntent = createScrollIntentTracker();
    expect(isIntent(wheel(3, 1))).toBe(true);
  });

  it('treats touchmove as immediate intent', () => {
    const isIntent = createScrollIntentTracker();
    expect(isIntent(new Event('touchmove'))).toBe(true);
  });

  it('treats scroll keys as immediate intent but not typing', () => {
    const isIntent = createScrollIntentTracker();
    expect(isIntent(new KeyboardEvent('keydown', { key: 'a' }))).toBe(false);
    expect(isIntent(new KeyboardEvent('keydown', { key: 'PageDown' }))).toBe(true);
  });
});
