import { describe, expect, it, vi } from 'vitest';

vi.mock('@redocly/theme/core/openapi', () => ({
  trimText: (text: string, max: number) => (text.length > max ? text.slice(0, max) : text),
}));

import { calculateMaxLength } from '../calculateMaxLength.js';

const CHAR_WIDTH = 10;

function createMeasureEl(): HTMLElement {
  let text = '';
  return {
    set textContent(value: string) {
      text = value;
    },
    get textContent() {
      return text;
    },
    get scrollWidth() {
      return text.length * CHAR_WIDTH;
    },
  } as unknown as HTMLElement;
}

const crumb = (name: string) => ({ name, href: `/${name}` });

describe('calculateMaxLength', () => {
  it('returns the minimum length when there are no breadcrumbs', () => {
    expect(calculateMaxLength([], 300, false, createMeasureEl())).toBe(10);
  });

  it('returns the minimum length when no width is available', () => {
    expect(calculateMaxLength([crumb('a'.repeat(20))], 0, false, createMeasureEl())).toBe(10);
  });

  it('returns the largest per-item length that fits the available width', () => {
    expect(calculateMaxLength([crumb('a'.repeat(20))], 150, false, createMeasureEl())).toBe(15);
  });

  it('accounts for the separators between multiple crumbs', () => {
    expect(
      calculateMaxLength(
        [crumb('a'.repeat(20)), crumb('b'.repeat(20))],
        310,
        false,
        createMeasureEl(),
      ),
    ).toBe(15);
  });

  it('never exceeds the longest name length', () => {
    expect(calculateMaxLength([crumb('a'.repeat(20))], 100_000, false, createMeasureEl())).toBe(20);
  });

  it('reserves room for the dropdown trigger when collapsed', () => {
    expect(calculateMaxLength([crumb('a'.repeat(20))], 150, true, createMeasureEl())).toBe(11);
  });

  it('grows monotonically as the available width increases', () => {
    const crumbs = [crumb('a'.repeat(40))];
    const narrow = calculateMaxLength(crumbs, 200, false, createMeasureEl());
    const wide = calculateMaxLength(crumbs, 350, false, createMeasureEl());
    expect(wide).toBeGreaterThan(narrow);
  });
});
