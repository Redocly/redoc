import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

import { useUserScrollIntent } from '../useUserScrollIntent.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return { ...actual, IS_BROWSER: true };
});

function renderIntent() {
  return renderHook(() => useUserScrollIntent('key')).result;
}

describe('useUserScrollIntent', () => {
  it.each([
    ['wheel', (): Event => new Event('wheel')],
    ['touchmove', (): Event => new Event('touchmove')],
    ['scroll-key keydown', (): Event => new KeyboardEvent('keydown', { key: 'PageDown' })],
  ])('flips on %s', (_name, makeEvent) => {
    const result = renderIntent();
    window.dispatchEvent(makeEvent());
    expect(result.current.current).toBe(true);
  });

  it('ignores typing (non-scroll keydown)', () => {
    const result = renderIntent();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
    expect(result.current.current).toBe(false);
  });

  it('ignores content clicks (mousedown below <html>)', () => {
    const result = renderIntent();
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(result.current.current).toBe(false);
  });

  it('flips on scrollbar mousedown (targets <html>)', () => {
    const result = renderIntent();
    document.documentElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(result.current.current).toBe(true);
  });

  it('re-arms when resetKey changes', () => {
    const { result, rerender } = renderHook(({ resetKey }) => useUserScrollIntent(resetKey), {
      initialProps: { resetKey: 'a' },
    });
    window.dispatchEvent(new Event('wheel'));
    expect(result.current.current).toBe(true);

    rerender({ resetKey: 'b' });
    expect(result.current.current).toBe(false);
  });
});
