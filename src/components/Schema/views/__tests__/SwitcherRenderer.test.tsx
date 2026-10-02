import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';

import type { ReactNode } from 'react';
import type { PropertyType, SwitcherOptionType, SwitcherType } from '../../../../types/schema.js';
import type { ApiItem } from '../../../../types/store.js';

import 'jest-styled-components';
import { contentType } from '../../../../types/common.js';
import { itemStoreAtom } from '../../../../jotai/itemStore.js';
import { globalStoreAtom } from '../../../../jotai/store.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { LEVEL_COLORS } from '../../utils.js';
import { DeepLinkSectionContext, ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { switcherLabel } from '../../../../types/schema.js';
import { appendVariantSuffix } from '../../../../utils/deep-link.js';
import { useVariantIndexFromHash } from '../../hooks/useVariantIndexFromHash.js';
import { SwitcherRenderer } from '../SwitcherRenderer.js';
import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../markdoc/markdocAdapter.js';

const TEST_ITEM_ID = 'test-item';

function makeSwitcherProperty(
  switcher: SwitcherType,
  properties?: Record<string, PropertyType>,
): PropertyType {
  return {
    type: 'object',
    switcher,
    properties,
  } as PropertyType;
}

function opt(
  partial: Partial<SwitcherOptionType> & {
    properties?: Record<string, PropertyType>;
  },
): SwitcherOptionType {
  return {
    isDeprecated: false,
    isDefaultMapping: false,
    properties: partial.properties ?? {},
    ...partial,
  };
}

function makeDiscriminator(
  propertyName: string,
  options: Record<string, { properties?: Record<string, PropertyType>; switcher?: SwitcherType }>,
): SwitcherType {
  return {
    type: 'discriminator',
    label: 'Discriminator',
    propertyName,
    options: Object.fromEntries(
      Object.entries(options).map(([key, val]) => [
        key,
        opt({
          properties: val.properties ?? {},
          ...val,
        }),
      ]),
    ),
  };
}

function renderWithStore(ui: React.ReactElement) {
  const store = createStore();
  const result = render(
    <MemoryRouter>
      <JotaiProvider store={store}>
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <ItemIdContext.Provider value={TEST_ITEM_ID}>{ui}</ItemIdContext.Provider>
        </MarkdownAdapterProvider>
      </JotaiProvider>
    </MemoryRouter>,
  );
  return { ...result, store };
}

function domSnapshotWithoutClasses(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attr) => {
      node.removeAttribute(attr.name);
    });
  });
  [...clone.attributes].forEach((attr) => {
    clone.removeAttribute(attr.name);
  });
  return clone.outerHTML;
}

describe('SwitcherRenderer discriminator state keys', () => {
  it('invokes onOneOfChange when discriminator tab changes and jsonPointer is set', () => {
    const onOneOfChange = vi.fn();
    const switcher: SwitcherType = {
      ...makeDiscriminator('method', {
        a: { properties: { method: { type: 'string' } as PropertyType } },
        b: { properties: { method: { type: 'string' } as PropertyType } },
      }),
      jsonPointer: '/components/schemas/Payment',
    };

    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer
        property={property}
        level={0}
        fieldParentsName={[]}
        onOneOfChange={onOneOfChange}
      />,
    );

    fireEvent.click(screen.getByText('b'));
    expect(onOneOfChange).toHaveBeenCalledWith({
      pointer: '/components/schemas/Payment',
      index: 1,
    });
    expect(store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator['method']).toBe(1);
  });

  it('should not collide state between nested discriminators with same label', () => {
    const innerDiscriminator = makeDiscriminator('name', {
      'Apple Pay': {
        properties: {
          name: { type: 'string' } as PropertyType,
          displayName: { type: 'string' } as PropertyType,
        },
      },
      'Google Pay': {
        properties: {
          name: { type: 'string' } as PropertyType,
          merchantName: { type: 'string' } as PropertyType,
        },
      },
    });

    const featureOneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        PaymentCardFeature: {
          isDeprecated: false,
          isDefaultMapping: false,
          properties: {
            name: { type: 'string' } as PropertyType,
          },
          switcher: innerDiscriminator,
        },
        null: { isDeprecated: false, isDefaultMapping: false },
      },
    };

    const rootDiscriminator = makeDiscriminator('method', {
      'payment-card': {
        properties: {
          method: { type: 'string' } as PropertyType,
          feature: {
            type: 'object',
            switcher: featureOneOf,
          } as PropertyType,
        },
      },
      ach: {
        properties: {
          method: { type: 'string' } as PropertyType,
        },
      },
    });

    const property = makeSwitcherProperty(rootDiscriminator);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
    );

    const segments = screen.getAllByText('payment-card');
    expect(segments.length).toBeGreaterThan(0);

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(state['method']).toBeUndefined();

    const achSegment = screen.getByText('ach');
    fireEvent.click(achSegment);

    const stateAfterClick = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(stateAfterClick['method']).toBe(1);

    const pcSegment = screen.getByText('payment-card');
    fireEvent.click(pcSegment);

    const stateAfterClickBack = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(stateAfterClickBack['method']).toBe(0);
  });

  it('should use path-based keys for nested discriminators', () => {
    const disc1 = makeDiscriminator('mode', {
      all: { properties: { mode: { type: 'string' } as PropertyType } },
      subset: { properties: { mode: { type: 'string' } as PropertyType } },
    });

    const disc2 = makeDiscriminator('mode', {
      unknown: { properties: { mode: { type: 'string' } as PropertyType } },
      restricted: { properties: { mode: { type: 'string' } as PropertyType } },
    });

    const { store } = renderWithStore(
      <>
        <SwitcherRenderer
          property={makeSwitcherProperty(disc1)}
          level={1}
          fieldParentsName={['currencies']}
        />
        <SwitcherRenderer
          property={makeSwitcherProperty(disc2)}
          level={1}
          fieldParentsName={['countries']}
        />
      </>,
    );

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(state['currencies/mode']).toBeUndefined();
    expect(state['countries/mode']).toBeUndefined();

    const subsetSegment = screen.getByText('subset');
    fireEvent.click(subsetSegment);

    const stateAfter = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(stateAfter['currencies/mode']).toBe(1);
    expect(stateAfter['countries/mode']).toBeUndefined();
    const restrictedSegment = screen.getByText('restricted');
    fireEvent.click(restrictedSegment);

    const stateAfter2 = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(stateAfter2['currencies/mode']).toBe(1);
    expect(stateAfter2['countries/mode']).toBe(1);
  });

  it('renders Enum (not Value) before discriminator when multiple mapping keys, no trailing Value', () => {
    const switcher = makeDiscriminator('type', {
      'three-columns': opt({
        properties: { col: { type: 'string' } as PropertyType },
      }),
      'two-columns': opt({
        properties: { col: { type: 'string' } as PropertyType },
      }),
      'one-column': opt({
        properties: { col: { type: 'string' } as PropertyType },
      }),
      list: opt({ properties: { col: { type: 'string' } as PropertyType } }),
    });

    const property = makeSwitcherProperty(switcher, {
      type: { type: 'string' } as PropertyType,
      message: { type: 'string' } as PropertyType,
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const enumRow = screen.getByTestId('schema-enum-values');
    expect(enumRow.textContent).toContain('Enum:');
    expect(enumRow.textContent).toContain('three-columns');
    expect(enumRow.textContent).toContain('two-columns');
    expect(enumRow.textContent).toContain('one-column');
    expect(enumRow.textContent).toContain('list');

    expect(screen.queryByText(/^Value:$/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('list'));
    expect(screen.queryByText(/^Value:$/)).not.toBeInTheDocument();
  });

  it('renders Value-labeled row before discriminator for single-value enum (TimelineAction-style)', () => {
    const switcher = makeDiscriminator('action', {
      'redemption-cancel': opt({
        properties: {
          action: {
            type: 'string',
            enum: ['redemption-cancel'],
          } as PropertyType,
          id: { type: 'string' } as PropertyType,
        },
      }),
      'resend-email': opt({
        properties: {
          action: { type: 'string', enum: ['resend-email'] } as PropertyType,
          id: { type: 'string' } as PropertyType,
        },
      }),
    });

    const property = makeSwitcherProperty(switcher, {});

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const enumRow = screen.getByTestId('schema-enum-values');
    expect(enumRow.textContent).toContain('Value:');
    expect(enumRow.textContent).toContain('"redemption-cancel"');

    fireEvent.click(screen.getByText('resend-email'));
    expect(enumRow.textContent).toContain('"resend-email"');
  });

  it('renders Value after discriminator only when property.const is set', () => {
    const switcher = makeDiscriminator('kind', {
      a: opt({
        properties: {
          kind: { type: 'string', const: 'a' } as PropertyType,
        },
      }),
    });

    const property = makeSwitcherProperty(switcher, {});

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const valueLabels = screen.getAllByText('Value:');
    expect(valueLabels.length).toBe(2);
  });

  it('prefers schema enum on discriminator property when present', () => {
    const switcher = makeDiscriminator('status', {
      a: opt({}),
      b: opt({}),
    });

    const property = makeSwitcherProperty(switcher, {
      status: { type: 'string', enum: ['x', 'y'] } as PropertyType,
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const enumRow = screen.getByTestId('schema-enum-values');
    expect(enumRow.textContent).toContain('x');
    expect(enumRow.textContent).toContain('y');
    expect(enumRow.textContent).not.toContain('a');
  });
});

function makeOneOf(variantCount: number): SwitcherType {
  const options: Record<string, SwitcherOptionType> = {};
  for (let i = 0; i < variantCount; i++) {
    options[`v${i}`] = opt({
      properties: { x: { type: 'string' } as PropertyType },
    });
  }
  return { type: 'oneOf', label: switcherLabel.ONE_OF, options };
}

describe('SwitcherRenderer state key shape', () => {
  it('root oneOf writes the switcher label as the activeOneOf key (exact string)', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } as PropertyType } }),
        v1: opt({ properties: { y: { type: 'string' } as PropertyType } }),
      },
    };
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
    );

    fireEvent.click(screen.getByText('v1'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf;
    expect(switcherLabel.ONE_OF).toBe('One of:');
    expect(state['One of:']).toBe(1);
  });

  it('root anyOf writes the switcher label as the activeOneOf key (exact string)', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ANY_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } as PropertyType } }),
        v1: opt({ properties: { y: { type: 'string' } as PropertyType } }),
      },
    };
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
    );

    fireEvent.click(screen.getByText('v1'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf;
    expect(switcherLabel.ANY_OF).toBe('Any of:');
    expect(state['Any of:']).toBe(1);
  });

  it('nested oneOf inside an object property writes `<parents>/<switcher label>`', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } as PropertyType } }),
        v1: opt({ properties: { y: { type: 'string' } as PropertyType } }),
      },
    };
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={1} fieldParentsName={['entityMetadata']} />,
    );

    fireEvent.click(screen.getByText('v1'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf;
    expect(state['entityMetadata/One of:']).toBe(1);
  });

  it('root discriminator writes the propertyName as the activeDiscriminator key', () => {
    const switcher = makeDiscriminator('itemType', {
      a: opt({ properties: { itemType: { type: 'string' } as PropertyType } }),
      b: opt({ properties: { itemType: { type: 'string' } as PropertyType } }),
    });
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
    );

    fireEvent.click(screen.getByText('b'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(state['itemType']).toBe(1);
  });

  it('nested array-item discriminator writes `<arrayPath[]>/<propertyName>`', () => {
    const switcher = makeDiscriminator('filterType', {
      a: opt({
        properties: { filterType: { type: 'string' } as PropertyType },
      }),
      b: opt({
        properties: { filterType: { type: 'string' } as PropertyType },
      }),
    });
    const property = makeSwitcherProperty(switcher);

    const { store } = renderWithStore(
      <SwitcherRenderer property={property} level={1} fieldParentsName={['tripFilters[]']} />,
    );

    fireEvent.click(screen.getByText('b'));

    const state = store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator;
    expect(state['tripFilters[]/filterType']).toBe(1);
  });
});

describe('SwitcherRenderer oneOf variant selection UI', () => {
  it('uses Segmented tablist for at most five variants and snapshots selector subtree', () => {
    const property = makeSwitcherProperty(makeOneOf(5));
    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();
    expect(screen.getByText('v0')).toBeInTheDocument();
    expect(domSnapshotWithoutClasses(tablist as HTMLElement)).toMatchInlineSnapshot(
      `"<div><button>v0</button><button>v1</button><button>v2</button><button>v3</button><button>v4</button></div>"`,
    );
  });

  it('uses dropdown for more than five variants and snapshots selector trigger', () => {
    const property = makeSwitcherProperty(makeOneOf(6));
    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'v0' });
    expect(trigger).toBeInTheDocument();
    expect(domSnapshotWithoutClasses(trigger as HTMLElement)).toMatchInlineSnapshot(
      `"<button><span>v0</span><svg><path></path></svg></button>"`,
    );
  });

  it('shows search field when opening dropdown with seven or more variants', () => {
    const property = makeSwitcherProperty(makeOneOf(7));
    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    fireEvent.click(screen.getByRole('button', { name: 'v0' }));

    expect(screen.getByPlaceholderText('Search items')).toBeInTheDocument();
  });
});

describe('appendVariantSuffix', () => {
  it('appends suffix to the last element of fieldParentsName', () => {
    expect(appendVariantSuffix(['body'], '&oneof=1')).toEqual(['body&oneof=1']);
  });

  it('only modifies the last element when multiple parents exist', () => {
    expect(appendVariantSuffix(['root', 'child'], '&d=2')).toEqual(['root', 'child&d=2']);
  });

  it('emits the suffix as the sole entry when fieldParentsName is empty', () => {
    expect(appendVariantSuffix([], '&oneof=0')).toEqual(['&oneof=0']);
  });

  it('emits the suffix as the sole entry when fieldParentsName is undefined', () => {
    expect(appendVariantSuffix(undefined, '&oneof=0')).toEqual(['&oneof=0']);
  });

  it('does not mutate the original array', () => {
    const original = ['body'];
    appendVariantSuffix(original, '&oneof=1');
    expect(original).toEqual(['body']);
  });

  it('stacks multiple suffixes when called repeatedly', () => {
    const first = appendVariantSuffix(['body'], '&oneof=1');
    const second = appendVariantSuffix(first, '&d=0');
    expect(second).toEqual(['body&oneof=1&d=0']);
  });
});

describe('useVariantIndexFromHash', () => {
  afterEach(() => {
    window.location.hash = '';
  });
  // `useVariantIndexFromHash` reads `window.location.hash` directly via
  // `useSyncExternalStore` (no `useLocation` subscription), so tests must
  // set jsdom's hash.
  function wrapper(hash: string) {
    window.location.hash = hash;
    return ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ hash }]}>
        <JotaiProvider>{children}</JotaiProvider>
      </MemoryRouter>
    );
  }

  it('returns the correct oneOf index at level 1', () => {
    const hash = '#plans/postplan/t=request&path=&oneof=1/trial&oneof=0/period';
    const { result } = renderHook(() => useVariantIndexFromHash('oneof', 3, 1), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(1);
  });

  it('returns the correct nested oneOf index at level 2', () => {
    const hash = '#plans/postplan/t=request&path=&oneof=1/trial&oneof=0/period';
    const { result } = renderHook(() => useVariantIndexFromHash('oneof', 3, 2), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(0);
  });

  it('returns -1 when level exceeds available segments', () => {
    const hash = '#plans/postplan/t=request&path=&oneof=1/trial&oneof=0/period';
    const { result } = renderHook(() => useVariantIndexFromHash('oneof', 3, 3), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(-1);
  });

  it('returns -1 when hash is empty', () => {
    const { result } = renderHook(() => useVariantIndexFromHash('oneof', 3, 1), {
      wrapper: wrapper(''),
    });
    expect(result.current).toBe(-1);
  });

  it('returns correct discriminator index at level 1', () => {
    const hash = '#pet/getpetbyid/t=request&path=body&d=2/status';
    const { result } = renderHook(() => useVariantIndexFromHash('d', 4, 1), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(2);
  });

  it('returns -1 when index exceeds count', () => {
    const hash = '#pet/getpetbyid/t=request&path=body&d=5/status';
    const { result } = renderHook(() => useVariantIndexFromHash('d', 3, 1), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(-1);
  });

  it('handles mixed oneof and discriminator segments independently', () => {
    const hash = '#op/test/t=request&path=body&oneof=2&d=1/child';
    const { result: oneOfResult } = renderHook(() => useVariantIndexFromHash('oneof', 4, 1), {
      wrapper: wrapper(hash),
    });
    const { result: discResult } = renderHook(() => useVariantIndexFromHash('d', 4, 1), {
      wrapper: wrapper(hash),
    });
    expect(oneOfResult.current).toBe(2);
    expect(discResult.current).toBe(1);
  });
});

describe('deep-link reload restoration', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  // Variant restoration reads `window.location.hash` directly (via
  // `useUrlHash`), so set jsdom's hash rather than the MemoryRouter entry.
  function renderAtHash(ui: React.ReactElement, hash?: string) {
    window.location.hash = hash ?? '';
    const store = createStore();
    const result = render(
      <MemoryRouter initialEntries={hash ? [{ hash }] : ['/']}>
        <JotaiProvider store={store}>
          <MarkdownAdapterProvider value={createMarkdocAdapter()}>
            <ItemIdContext.Provider value={TEST_ITEM_ID}>
              <DeepLinkSectionContext.Provider value={{ t: 'request' }}>
                {ui}
              </DeepLinkSectionContext.Provider>
            </ItemIdContext.Provider>
          </MarkdownAdapterProvider>
        </JotaiProvider>
      </MemoryRouter>,
    );
    return { ...result, store };
  }

  it('restores a nested oneOf tab from the hash on reload', () => {
    const innerOneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        iv0: opt({
          properties: { targetProp: { type: 'string' } as PropertyType },
        }),
        iv1: opt({
          properties: { otherProp: { type: 'string' } as PropertyType },
        }),
      },
    };
    const outerOneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { alpha: { type: 'string' } as PropertyType } }),
        v1: opt({ switcher: innerOneOf }),
      },
    };
    const property = makeSwitcherProperty(outerOneOf);

    renderAtHash(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
      '#test-item/t=request&path=&oneof=1&oneof=0/targetprop',
    );

    expect(screen.getByText('targetProp')).toBeInTheDocument();
    expect(screen.queryByText('otherProp')).not.toBeInTheDocument();
  });

  it('restores a nested discriminator branch from the hash on reload', () => {
    const innerDisc = makeDiscriminator('innerKind', {
      ia: { properties: { iaField: { type: 'string' } as PropertyType } },
      ib: { properties: { ibField: { type: 'string' } as PropertyType } },
    });
    const outerDisc = makeDiscriminator('outerKind', {
      oa: {
        properties: {
          sub: { type: 'object', switcher: innerDisc } as PropertyType,
        },
      },
      ob: { properties: { obField: { type: 'string' } as PropertyType } },
    });
    const property = makeSwitcherProperty(outerDisc);

    renderAtHash(
      <SwitcherRenderer property={property} level={0} fieldParentsName={[]} />,
      '#test-item/t=request&path=&d=0/sub&d=1/ibfield',
    );

    expect(screen.getByText('ibField')).toBeInTheDocument();
    expect(screen.queryByText('iaField')).not.toBeInTheDocument();
  });

  it('emits &oneof=<idx> in child deep-link ids for a root oneOf', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } as PropertyType } }),
        v1: opt({ properties: { y: { type: 'string' } as PropertyType } }),
      },
    };
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&oneof=1/y',
    );

    expect(screen.getByText('y')).toBeInTheDocument();
    expect(container.querySelector('[id*="oneof=1"]')).toBeTruthy();
  });

  it('emits &oneof=<idx> in child deep-link ids for a root oneOf rendered at body level 1', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } as PropertyType } }),
        v1: opt({ properties: { y: { type: 'string' } as PropertyType } }),
      },
    };
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={1}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&oneof=1/y',
    );

    expect(screen.getByText('y')).toBeInTheDocument();
    expect(container.querySelector('[id*="oneof=1"]')).toBeTruthy();
  });

  it('emits &d=<idx> in child deep-link ids for a root discriminator', () => {
    const switcher = makeDiscriminator('kind', {
      a: { properties: { aField: { type: 'string' } as PropertyType } },
      b: { properties: { bField: { type: 'string' } as PropertyType } },
    });
    const { container } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&d=1/bfield',
    );

    expect(screen.getByText('bField')).toBeInTheDocument();
    expect(container.querySelector('[id*="&d=1"]')).toBeTruthy();
  });

  it('does not render a phantom "." parent prefix for a root variant marker', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } as PropertyType } }),
        v1: opt({ properties: { y: { type: 'string' } as PropertyType } }),
      },
    };
    renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );
    expect(screen.queryByText('.', { exact: true })).not.toBeInTheDocument();
    expect(screen.queryByText(/oneof=/)).not.toBeInTheDocument();
  });

  it('seeds activeDiscriminator in the itemStore from a hash discriminator marker', () => {
    const switcher = makeDiscriminator('method', {
      a: { properties: { aField: { type: 'string' } as PropertyType } },
      b: { properties: { bField: { type: 'string' } as PropertyType } },
    });

    const { store } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&d=1/bfield',
    );

    expect(store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator['method']).toBe(1);
  });

  it('seeds activeOneOf in the itemStore from a hash oneof marker', () => {
    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } as PropertyType } }),
        v1: opt({ properties: { y: { type: 'string' } as PropertyType } }),
      },
    };

    const { store } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
      '#test-item/t=request&path=&oneof=1/y',
    );

    expect(store.get(itemStoreAtom(TEST_ITEM_ID)).activeOneOf['One of:']).toBe(1);
  });

  it('does not seed the itemStore when the hash has no variant marker', () => {
    const switcher = makeDiscriminator('method', {
      a: { properties: { aField: { type: 'string' } as PropertyType } },
      b: { properties: { bField: { type: 'string' } as PropertyType } },
    });

    const { store } = renderAtHash(
      <SwitcherRenderer
        property={makeSwitcherProperty(switcher)}
        level={0}
        fieldParentsName={[]}
      />,
    );

    expect(store.get(itemStoreAtom(TEST_ITEM_ID)).activeDiscriminator['method']).toBeUndefined();
  });
});

describe('SwitcherRenderer description and variant behavior', () => {
  it('should fall back to parent description when the active oneOf variant has none', () => {
    const oneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        v0: opt({ properties: { x: { type: 'string' } as PropertyType } }),
      },
    };
    const property: PropertyType = {
      type: 'object',
      switcher: oneOf,
      description: 'parent fallback text',
    } as PropertyType;

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);
    expect(screen.getByText('parent fallback text')).toBeInTheDocument();
  });

  it('should only include the discriminator property from base properties, dropping siblings', () => {
    const discriminator = makeDiscriminator('kind', {
      a: { properties: { aField: { type: 'string' } as PropertyType } },
    });
    const property = makeSwitcherProperty(discriminator, {
      kind: { type: 'string' } as PropertyType,
      leakedSibling: { type: 'string' } as PropertyType,
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);
    expect(screen.queryByText('leakedSibling')).not.toBeInTheDocument();
    expect(screen.getByText('aField')).toBeInTheDocument();
  });

  it('should render the variant title in parentheses for a primitive oneOf option', () => {
    const oneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        scalarVariant: {
          isDeprecated: false,
          isDefaultMapping: false,
          title: 'ScalarTitle',
        },
      },
    };
    const property: PropertyType = {
      type: 'string',
      switcher: oneOf,
    } as PropertyType;

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);
    expect(screen.getByText('(ScalarTitle)')).toBeInTheDocument();
  });

  it('preserves the variant property order when the variant already exposes the discriminator field', () => {
    const discriminator = makeDiscriminator('itemType', {
      coffee: {
        properties: {
          name: { type: 'string' } as PropertyType,
          status: { type: 'string' } as PropertyType,
          itemType: { type: 'string' } as PropertyType,
          brewingMethod: { type: 'string' } as PropertyType,
        },
      },
    });
    const property = makeSwitcherProperty(discriminator, {
      itemType: { type: 'string' } as PropertyType,
    });

    renderWithStore(<SwitcherRenderer property={property} level={0} fieldParentsName={[]} />);

    const renderedNames = screen.getAllByText(/^(name|status|itemType|brewingMethod)$/);
    expect(renderedNames.map((node) => node.textContent)).toEqual([
      'name',
      'status',
      'itemType',
      'brewingMethod',
    ]);
  });
});

describe('OneOfSwitcher variant nesting chrome', () => {
  function makeObjectOneOf(): SwitcherType {
    return {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        object: opt({ properties: { id: { type: 'string' } as PropertyType } }),
        null: opt({ typeLabel: 'null' }),
      },
    };
  }

  it('wraps a switcher-only variant (nullable discriminated oneOf) in collapsible nesting chrome', () => {
    // Mirrors `options: oneOf [AiWriterAgentJobOptions, null]` where the
    // selected variant is itself a discriminated oneOf: the option carries only
    // `switcher` (no `properties`/`items`). Its fields must render nested under
    // the owning property row, not flat at the same level.
    const innerDiscriminator = makeDiscriminator('trigger', {
      MANUAL: {
        properties: {
          trigger: { type: 'string' } as PropertyType,
          note: { type: 'string' } as PropertyType,
        },
      },
      SCHEDULED: {
        properties: {
          trigger: { type: 'string' } as PropertyType,
        },
      },
    });
    const nullableOneOf: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: {
        AiWriterAgentJobOptions: opt({ properties: undefined, switcher: innerDiscriminator }),
        null: opt({ properties: undefined, typeLabel: 'null' }),
      },
    };

    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(nullableOneOf)}
        level={2}
        fieldParentsName={['options']}
      />,
    );

    const nestedWrapper = container.querySelector('[data-schema-nested-open]');
    expect(nestedWrapper).toBeTruthy();
    // Collapsed by default: variant fields hidden behind the toggle.
    expect(screen.queryByText('note')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/^show/i));
    expect(screen.getByText('note')).toBeInTheDocument();
  });

  it('colors the variant nesting chrome with the owning row level, matching plain objects', () => {
    // A property row at level 1 renders its oneOf switcher at level 2. The
    // nesting chrome (anchor line / circle) must use the row's level (1) so a
    // oneOf property expands with the same color as a plain object property.
    const { container } = renderWithStore(
      <SwitcherRenderer
        property={makeSwitcherProperty(makeObjectOneOf())}
        level={2}
        fieldParentsName={['actor']}
      />,
    );

    fireEvent.click(screen.getByText(/^show/i));

    const nested = container.querySelector('[data-schema-nested-open="true"] > div');
    expect(nested).toBeTruthy();
    expect(nested).toHaveStyleRule('border-left', `1px solid ${LEVEL_COLORS[1]}`);
  });
});

describe('SwitcherRenderer schema title link', () => {
  const SCHEMA_SLUG = '/docs/openapi/schemas/timepluralunit';

  function renderPrimitiveVariant(option: SwitcherOptionType) {
    const store = createStore();
    const items: ApiItem[] = [
      {
        type: 'link',
        link: SCHEMA_SLUG,
        label: 'TimePluralUnit',
        httpVerb: 'schema',
        routeSlug: SCHEMA_SLUG,
        content: {
          contentType: contentType.ITEM,
          children: [],
          meta: { name: 'TimePluralUnit' },
        },
      },
    ];
    store.set(globalStoreAtom, {
      items,
      replayDefinition: null,
      store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
      options: normalizeOptions({
        specType: 'openapi',
        downloadUrls: [],
        metadata: {},
        basePath: '',
        schemaDefinitionsTagName: 'Schemas',
      }),
    });

    const switcher: SwitcherType = {
      type: 'oneOf',
      label: switcherLabel.ONE_OF,
      options: { TimePluralUnit: option, other: opt({ typeLabel: 'null', properties: undefined }) },
    };

    return render(
      <MemoryRouter>
        <JotaiProvider store={store}>
          <MarkdownAdapterProvider value={createMarkdocAdapter()}>
            <ItemIdContext.Provider value={TEST_ITEM_ID}>
              <SwitcherRenderer
                property={makeSwitcherProperty(switcher)}
                level={1}
                fieldParentsName={['unit']}
              />
            </ItemIdContext.Provider>
          </MarkdownAdapterProvider>
        </JotaiProvider>
      </MemoryRouter>,
    );
  }

  it('links the variant title to its schema definition page', () => {
    const { container } = renderPrimitiveVariant(
      opt({
        typeLabel: 'string',
        title: 'TimePluralUnit',
        schemaName: 'TimePluralUnit',
        properties: undefined,
      }),
    );

    const link = container.querySelector(`a[href="${SCHEMA_SLUG}"]`);
    expect(link).toBeTruthy();
    expect(link).toHaveTextContent('(TimePluralUnit)');
  });

  it('falls back to the option key as the link text when the variant has no title', () => {
    const { container } = renderPrimitiveVariant(
      opt({ typeLabel: 'string', schemaName: 'TimePluralUnit', properties: undefined }),
    );

    const link = container.querySelector(`a[href="${SCHEMA_SLUG}"]`);
    expect(link).toBeTruthy();
    expect(link).toHaveTextContent('(TimePluralUnit)');
  });

  it('keeps the title as plain text when the variant is not a named schema', () => {
    const { container } = renderPrimitiveVariant(
      opt({ typeLabel: 'string', title: 'Inline', properties: undefined }),
    );

    expect(screen.getByText('(Inline)')).toBeInTheDocument();
    expect(container.querySelector('a[href*="schemas"]')).toBeNull();
  });
});
