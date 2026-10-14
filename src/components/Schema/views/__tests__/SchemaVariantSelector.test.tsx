import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import type { SwitcherOptionType } from '../../../../types/schema.js';

import { SchemaVariantSelector } from '../SchemaVariantSelector.js';

type EntryOverrides = Partial<SwitcherOptionType>;

function makeOptionEntries(
  count: number,
  overrideByIndex: Record<number, EntryOverrides> = {},
): [string, SwitcherOptionType][] {
  return Array.from({ length: count }, (_, idx) => [
    `variant-${idx}`,
    {
      isDeprecated: false,
      isDefaultMapping: false,
      ...overrideByIndex[idx],
    } as SwitcherOptionType,
  ]);
}

function cloneEntries(entries: [string, SwitcherOptionType][]): [string, SwitcherOptionType][] {
  return entries.map(([key, opt]) => [key, { ...opt }]);
}

describe('SchemaVariantSelector', () => {
  let originalOffsetWidth: PropertyDescriptor | undefined;
  let originalScrollWidth: PropertyDescriptor | undefined;

  beforeEach(() => {
    originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    originalScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth');
  });

  afterEach(() => {
    if (originalOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
    }
    if (originalScrollWidth) {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originalScrollWidth);
    }
  });

  it('renders segmented selector for five or fewer options', () => {
    render(
      <SchemaVariantSelector
        optionEntries={makeOptionEntries(5)}
        activeIndex={0}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'variant-0' })).toBeInTheDocument();
  });

  it('renders dropdown selector when there are more than five options', () => {
    render(
      <SchemaVariantSelector
        optionEntries={makeOptionEntries(6)}
        activeIndex={0}
        onChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'variant-0' })).toBeInTheDocument();
  });

  it('calls onChange with selected index when tab is clicked', () => {
    const onChange = vi.fn();
    render(
      <SchemaVariantSelector
        optionEntries={makeOptionEntries(3)}
        activeIndex={0}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'variant-1' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('switches to the dropdown and stays there across resizes when items are truncated (no flicker)', () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 80,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 120,
    });

    render(
      <SchemaVariantSelector
        optionEntries={makeOptionEntries(4)}
        activeIndex={0}
        onChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'variant-0' })).toBeInTheDocument();

    fireEvent(window, new Event('resize'));
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();

    fireEvent(window, new Event('resize'));
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('does not re-subscribe resize listener for semantically identical options', () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 80,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 120,
    });

    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const initialEntries = makeOptionEntries(3, {
      1: { isDeprecated: true },
    });
    const { rerender } = render(
      <SchemaVariantSelector optionEntries={initialEntries} activeIndex={1} onChange={vi.fn()} />,
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    const initialSubscriptions = addEventListenerSpy.mock.calls.filter(
      ([eventName]) => eventName === 'resize',
    ).length;

    rerender(
      <SchemaVariantSelector
        optionEntries={cloneEntries(initialEntries)}
        activeIndex={1}
        onChange={vi.fn()}
      />,
    );

    const subscriptionsAfterRerender = addEventListenerSpy.mock.calls.filter(
      ([eventName]) => eventName === 'resize',
    ).length;
    expect(subscriptionsAfterRerender).toBe(initialSubscriptions);

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
