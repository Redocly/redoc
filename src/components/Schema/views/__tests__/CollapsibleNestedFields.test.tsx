import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { PropertyType } from '../../../../types/schema.js';
import type { DeepLinkSectionValue } from '../../../../hooks/useDeepLinkSection.js';
import type { ReactNode } from 'react';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { itemStoreAtom } from '../../../../jotai/itemStore.js';
import { DeepLinkSectionContext, ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { normalizeOptions } from '../../../../options/normalizeOptions.js';
import { buildSchemaFieldSuffix } from '../../hooks/useSchemaFieldDeepLink.js';
import {
  buildNestedFieldsLabel,
  countNestedFields,
  CollapsibleNestedFields,
  useIsDeepLinkTarget,
  getCollapsibleNestedInitialExpanded,
} from '../CollapsibleNestedFields.js';
import { switcherLabel } from '../../../../types/schema.js';
import { reassertUrlHash } from '../../../../hooks/useUrlHashReassert.js';
import { createStore, Provider } from 'jotai';

describe('useIsDeepLinkTarget', () => {
  afterEach(() => {
    window.location.hash = '';
  });
  // `useIsDeepLinkTarget` reads `window.location.hash` directly via
  // `useSyncExternalStore` (no `useLocation` subscription), so tests must
  // set jsdom's hash — the MemoryRouter entry is kept only for consistency
  // with surrounding test infrastructure.
  function wrapper(hash: string) {
    window.location.hash = hash;
    return ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ hash }]}>{children}</MemoryRouter>
    );
  }

  it('returns true when hash path matches fieldPath as a parent prefix (slash)', () => {
    const hash = '#pet/getpetbyid/t=request&path=body/name';
    const { result } = renderHook(() => useIsDeepLinkTarget('body'), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(true);
  });

  it('returns true when hash path matches fieldPath as a parent prefix (ampersand)', () => {
    const hash = '#pet/getpetbyid/t=request&path=body&oneof=1/name';
    const { result } = renderHook(() => useIsDeepLinkTarget('body'), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(true);
  });

  it('returns false when fieldPath is not a prefix of hash path', () => {
    const hash = '#pet/getpetbyid/t=request&path=body/name';
    const { result } = renderHook(() => useIsDeepLinkTarget('other'), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(false);
  });

  it('returns false when hash is empty', () => {
    const { result } = renderHook(() => useIsDeepLinkTarget('body'), {
      wrapper: wrapper(''),
    });
    expect(result.current).toBe(false);
  });

  it('returns false when fieldPath is undefined', () => {
    const hash = '#pet/getpetbyid/t=request&path=body/name';
    const { result } = renderHook(() => useIsDeepLinkTarget(undefined), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(false);
  });

  it('matches case-insensitively', () => {
    const hash = '#Pet/GetPetById/t=request&path=Body/Name';
    const { result } = renderHook(() => useIsDeepLinkTarget('body'), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(true);
  });

  it('does not false-match partial field names', () => {
    const hash = '#op/test/t=request&path=bodyExtra/name';
    const { result } = renderHook(() => useIsDeepLinkTarget('body'), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(false);
  });

  it('matches when target is inside an array', () => {
    const hash = '#op/test/t=request&path=billingAddress/phoneNumbers[]/label';
    const { result } = renderHook(() => useIsDeepLinkTarget('billingAddress/phoneNumbers'), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(true);
  });

  it('matches the parent of an array whose items hold the target', () => {
    const hash = '#op/test/t=request&path=billingAddress/phoneNumbers[]/label';
    const { result } = renderHook(() => useIsDeepLinkTarget('billingAddress'), {
      wrapper: wrapper(hash),
    });
    expect(result.current).toBe(true);
  });

  // Legacy openapi-docs deep links carry no `[]` array markers.
  describe('legacy hashes without [] array markers', () => {
    it('matches a fieldPath containing [] against a legacy hash (slash suffix)', () => {
      const hash =
        '#ai-jobs/listaijobs/t=response&c=200&path=items&d=1/options&oneof=0/metadata/writeragentid';
      const { result } = renderHook(() => useIsDeepLinkTarget('items[]&d=1/options&oneof=0'), {
        wrapper: wrapper(hash),
      });
      expect(result.current).toBe(true);
    });

    it('matches a fieldPath containing [] against a legacy hash (ampersand suffix)', () => {
      const hash = '#ai-jobs/listaijobs/t=response&c=200&path=items&d=1/options';
      const { result } = renderHook(() => useIsDeepLinkTarget('items[]'), {
        wrapper: wrapper(hash),
      });
      expect(result.current).toBe(true);
    });

    it('matches a legacy hash that ends exactly at the array field', () => {
      const hash = '#ai-jobs/listaijobs/t=response&c=200&path=items';
      const { result } = renderHook(() => useIsDeepLinkTarget('items[]'), {
        wrapper: wrapper(hash),
      });
      expect(result.current).toBe(true);
    });

    it('does not false-match partial field names for legacy hashes', () => {
      const hash = '#op/test/t=response&c=200&path=itemsize/foo';
      const { result } = renderHook(() => useIsDeepLinkTarget('items[]'), {
        wrapper: wrapper(hash),
      });
      expect(result.current).toBe(false);
    });

    it('does not expand containers when a marker-free fieldPath merely ends the hash', () => {
      // Guard: the end-of-hash rule only applies to fieldPaths that carry [],
      // so linking a plain object row keeps today's collapsed behavior.
      const hash = '#op/test/t=request&path=body';
      const { result } = renderHook(() => useIsDeepLinkTarget('body'), {
        wrapper: wrapper(hash),
      });
      expect(result.current).toBe(false);
    });
  });
});

describe('buildNestedFieldsLabel', () => {
  it('counts object properties for a plain object', () => {
    const property: Pick<PropertyType, 'properties' | 'items'> = {
      properties: {
        a: { type: 'string' },
        b: { type: 'number' },
      } as Record<string, PropertyType>,
    };
    expect(buildNestedFieldsLabel(property)).toBe('Show 2 properties');
  });

  it('omits the count and uses singular for a single object property', () => {
    const property: Pick<PropertyType, 'properties' | 'items'> = {
      properties: { a: { type: 'string' } } as Record<string, PropertyType>,
    };
    expect(buildNestedFieldsLabel(property)).toBe('Show property');
  });

  it('counts item properties for an array of object', () => {
    const property: Pick<PropertyType, 'properties' | 'items'> = {
      items: [
        {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            category: { type: 'string' },
            price: { type: 'number' },
            inStock: { type: 'boolean' },
          },
        } as PropertyType,
      ],
    };
    expect(buildNestedFieldsLabel(property)).toBe('Show 5 array properties');
  });

  it('omits the count and uses singular for an array of object with a single property', () => {
    const property: Pick<PropertyType, 'properties' | 'items'> = {
      items: [
        {
          type: 'object',
          properties: { id: { type: 'integer' } },
        } as PropertyType,
      ],
    };
    expect(buildNestedFieldsLabel(property)).toBe('Show array property');
  });

  it('honors skipReadOnly when counting array item properties', () => {
    const property: Pick<PropertyType, 'properties' | 'items'> = {
      items: [
        {
          type: 'object',
          properties: {
            id: { type: 'integer', accessMode: 'read-only' },
            name: { type: 'string' },
          },
        } as PropertyType,
      ],
    };
    expect(buildNestedFieldsLabel(property, true)).toBe('Show array property');
  });

  it('counts properties from the first switcher option for an array of oneOf', () => {
    const property: Pick<PropertyType, 'properties' | 'items'> = {
      items: [
        {
          type: 'object',
          switcher: {
            type: 'oneOf',
            label: switcherLabel.ONE_OF,
            options: {
              Cat: {
                isDeprecated: false,
                isDefaultMapping: false,
                properties: {
                  name: { type: 'string' },
                  meow: { type: 'string' },
                },
              },
              Dog: {
                isDeprecated: false,
                isDefaultMapping: false,
                properties: {
                  name: { type: 'string' },
                },
              },
            },
          },
        } as PropertyType,
      ],
    };
    expect(buildNestedFieldsLabel(property)).toBe('Show 2 array properties');
  });

  it('falls back to "Show details" for an array of primitives', () => {
    const property: Pick<PropertyType, 'properties' | 'items'> = {
      items: [{ type: 'string' } as PropertyType],
    };
    expect(buildNestedFieldsLabel(property)).toBe('Show details');
  });

  it('counts the first discriminator option for an object with a discriminator switcher', () => {
    const property: Pick<PropertyType, 'properties' | 'items' | 'switcher'> = {
      properties: {
        name: { type: 'string' },
        itemType: { type: 'string' },
      } as Record<string, PropertyType>,
      switcher: {
        type: 'discriminator',
        label: switcherLabel.DISCRIMINATOR,
        propertyName: 'itemType',
        options: {
          coffee: {
            isDeprecated: false,
            isDefaultMapping: false,
            properties: {
              name: { type: 'string' },
              itemType: { type: 'string' },
              brewingMethod: { type: 'string' },
            } as Record<string, PropertyType>,
          },
          tea: {
            isDeprecated: false,
            isDefaultMapping: false,
            properties: {
              name: { type: 'string' },
              itemType: { type: 'string' },
              steepingTime: { type: 'number' },
            } as Record<string, PropertyType>,
          },
        },
      },
    };
    expect(buildNestedFieldsLabel(property)).toBe('Show 3 properties');
  });
});

describe('getCollapsibleNestedInitialExpanded', () => {
  it('returns false for any level when schemasExpansionLevel is unset (required-only default)', () => {
    expect(getCollapsibleNestedInitialExpanded(true, 0)).toBe(false);
    expect(getCollapsibleNestedInitialExpanded(true, 1)).toBe(false);
    expect(getCollapsibleNestedInitialExpanded(true, 5)).toBe(false);
  });

  it('returns false when expandByDefault is false', () => {
    expect(getCollapsibleNestedInitialExpanded(false, 0)).toBe(false);
  });

  it('returns false when expandByDefault is undefined', () => {
    expect(getCollapsibleNestedInitialExpanded(undefined, 0)).toBe(false);
  });

  it('expands deeper levels when schemasExpansionLevel is set above the default', () => {
    expect(getCollapsibleNestedInitialExpanded(true, 3, 4)).toBe(true);
    expect(getCollapsibleNestedInitialExpanded(true, 4, 4)).toBe(false);
  });

  it("expands every level when schemasExpansionLevel is 'all' (Infinity)", () => {
    expect(getCollapsibleNestedInitialExpanded(true, 9, Infinity)).toBe(true);
  });

  it('collapses everything when schemasExpansionLevel is 0', () => {
    expect(getCollapsibleNestedInitialExpanded(true, 0, 0)).toBe(false);
  });
});

const stubProperty: Pick<PropertyType, 'properties' | 'items'> = {
  properties: { x: { type: 'string' } } as Record<string, PropertyType>,
};

function renderCollapsible(initialHash: string) {
  // The component reads `window.location.hash` (via `useUrlHash`), not the
  // MemoryRouter location.
  window.location.hash = initialHash;
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/test', hash: initialHash }]}>
      <CollapsibleNestedFields
        level={2}
        property={stubProperty}
        fieldPath="body"
        expandByDefault={false}
      >
        <div data-testid="nested-content">nested children</div>
      </CollapsibleNestedFields>
    </MemoryRouter>,
  );
}

describe('CollapsibleNestedFields component', () => {
  afterEach(() => {
    window.location.hash = '';
  });

  it('starts collapsed when the hash does not target this fieldPath', () => {
    renderCollapsible('');
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });

  it('starts expanded when the initial hash already targets this fieldPath', () => {
    renderCollapsible('#op/t=request&path=body/name');
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });

  it('re-expands when the deep link the page already sits at is re-opened', () => {
    const { container } = renderCollapsible('#op/t=request&path=body/name');
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();

    fireEvent.click(container.querySelector('button') as HTMLButtonElement);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();

    // Re-selecting the same search result: the hash cannot change, so only the reassert
    // tells the panel to re-apply the deep link over the reader's collapse.
    act(() => reassertUrlHash());

    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });

  it('toggles via the show/hide button', () => {
    const { container } = renderCollapsible('');
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();

    const toggleButton = container.querySelector('button');
    expect(toggleButton).not.toBeNull();
    fireEvent.click(toggleButton as HTMLButtonElement);
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();

    fireEvent.click(toggleButton as HTMLButtonElement);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });
});

describe('CollapsibleNestedFields default expansion driven by schemasExpansionLevel', () => {
  const emptyStore = {
    schemaStore: {},
    exampleStore: {},
    securitySchemeStore: {},
  } as GlobalStoreAtom['store'];

  function renderWithLevel(level: number, schemasExpansionLevel?: number) {
    const jotaiStore = createStore();
    const options = normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      ...(schemasExpansionLevel !== undefined ? { schemasExpansionLevel } : {}),
    });
    jotaiStore.set(globalStoreAtom, {
      items: [],
      store: emptyStore,
      options,
      replayDefinition: null,
    });

    return render(
      <MemoryRouter initialEntries={[{ pathname: '/test', hash: '' }]}>
        <Provider store={jotaiStore}>
          <CollapsibleNestedFields
            level={level}
            property={stubProperty}
            fieldPath="body"
            expandByDefault
          >
            <div data-testid="nested-content">nested children</div>
          </CollapsibleNestedFields>
        </Provider>
      </MemoryRouter>,
    );
  }

  it('keeps the original default (collapsed past the first level) when unset', () => {
    renderWithLevel(2);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });

  it('expands deeper levels once schemasExpansionLevel is set', () => {
    renderWithLevel(2, 4);
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });

  it('stops expanding at the configured level', () => {
    renderWithLevel(4, 4);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });
});

describe('CollapsibleNestedFields required-driven default expansion', () => {
  const emptyStore = {
    schemaStore: {},
    exampleStore: {},
    securitySchemeStore: {},
  } as GlobalStoreAtom['store'];

  function renderRequired(opts: {
    level: number;
    required?: boolean;
    schemasExpansionLevel?: number;
  }) {
    const { level, required, schemasExpansionLevel } = opts;
    const jotaiStore = createStore();
    const options = normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      ...(schemasExpansionLevel !== undefined ? { schemasExpansionLevel } : {}),
    });
    jotaiStore.set(globalStoreAtom, {
      items: [],
      store: emptyStore,
      options,
      replayDefinition: null,
    });

    return render(
      <MemoryRouter initialEntries={[{ pathname: '/test', hash: '' }]}>
        <Provider store={jotaiStore}>
          {/* expandByDefault=false so only the required-driven rule can expand it */}
          <CollapsibleNestedFields
            level={level}
            property={stubProperty}
            fieldPath="body"
            expandByDefault={false}
            required={required}
          >
            <div data-testid="nested-content">nested children</div>
          </CollapsibleNestedFields>
        </Provider>
      </MemoryRouter>,
    );
  }

  it('auto-expands a required field deeper than the first level', () => {
    renderRequired({ level: 3, required: true });
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });

  it('keeps a non-required deep field collapsed', () => {
    renderRequired({ level: 3, required: false });
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });

  it('stops auto-expanding required fields past the required-expand depth', () => {
    renderRequired({ level: 5, required: true });
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });

  it('does not apply required-driven expansion when schemasExpansionLevel is configured', () => {
    renderRequired({ level: 3, required: true, schemasExpansionLevel: 0 });
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });
});

describe('CollapsibleNestedFields section "Expand all" baseline', () => {
  const emptyStore = {
    schemaStore: {},
    exampleStore: {},
    securitySchemeStore: {},
  } as GlobalStoreAtom['store'];

  const ITEM_ID = '/op';
  const SECTION: DeepLinkSectionValue = { t: 'request' };
  const BASELINE_KEY = buildSchemaFieldSuffix(SECTION, '');

  function renderWithBaseline(initialBaseline?: boolean) {
    const jotaiStore = createStore();
    jotaiStore.set(globalStoreAtom, {
      items: [],
      store: emptyStore,
      options: normalizeOptions({ specType: 'openapi', downloadUrls: [], metadata: {} }),
      replayDefinition: null,
    });
    if (initialBaseline !== undefined) {
      jotaiStore.set(itemStoreAtom(ITEM_ID), {
        expandableSections: { [BASELINE_KEY]: initialBaseline },
      });
    }
    const setBaseline = (value: boolean) =>
      act(() => {
        jotaiStore.set(itemStoreAtom(ITEM_ID), (curr) => ({
          expandableSections: { [BASELINE_KEY]: value },
          collapsibles: Object.fromEntries(Object.keys(curr.collapsibles).map((k) => [k, value])),
        }));
      });

    const utils = render(
      <MemoryRouter initialEntries={[{ pathname: ITEM_ID, hash: '' }]}>
        <Provider store={jotaiStore}>
          <ItemIdContext.Provider value={ITEM_ID}>
            <DeepLinkSectionContext.Provider value={SECTION}>
              {/* level 2 + expandByDefault=false → collapsed unless the baseline says otherwise */}
              <CollapsibleNestedFields
                level={2}
                property={stubProperty}
                fieldPath="body"
                expandByDefault={false}
              >
                <div data-testid="nested-content">nested children</div>
              </CollapsibleNestedFields>
            </DeepLinkSectionContext.Provider>
          </ItemIdContext.Provider>
        </Provider>
      </MemoryRouter>,
    );
    return { ...utils, setBaseline };
  }

  it('starts expanded when the section baseline is already true', () => {
    renderWithBaseline(true);
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });

  it('re-expands and re-collapses when the baseline flips (Expand all / Collapse all)', () => {
    const { setBaseline } = renderWithBaseline(undefined);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();

    setBaseline(true);
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();

    setBaseline(false);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });

  it('lets "Collapse all" override a field the user manually expanded', () => {
    const { container, setBaseline } = renderWithBaseline(undefined);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();

    fireEvent.click(container.querySelector('button') as HTMLButtonElement);
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();

    setBaseline(false);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });

  it('lets "Expand all" override a field the user manually collapsed', () => {
    const { container, setBaseline } = renderWithBaseline(undefined);
    const toggle = container.querySelector('button') as HTMLButtonElement;

    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();

    setBaseline(true);
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });
});

describe('countNestedFields', () => {
  it('counts object properties', () => {
    expect(
      countNestedFields({
        properties: { a: { type: 'string' }, b: { type: 'number' } } as Record<
          string,
          PropertyType
        >,
      }),
    ).toEqual({ count: 2, isArray: false });
  });

  it('flags array item properties', () => {
    expect(
      countNestedFields({
        items: [{ type: 'object', properties: { id: { type: 'integer' } } } as PropertyType],
      }),
    ).toEqual({ count: 1, isArray: true });
  });

  it('returns null for an array of primitives', () => {
    expect(countNestedFields({ items: [{ type: 'string' } as PropertyType] })).toBeNull();
  });
});

describe('CollapsibleNestedFields lazy-mounts nested children', () => {
  const emptyStore = {
    schemaStore: {},
    exampleStore: {},
    securitySchemeStore: {},
  } as GlobalStoreAtom['store'];

  const ITEM_ID = '/op';
  const SECTION: DeepLinkSectionValue = { t: 'request' };
  const BASELINE_KEY = buildSchemaFieldSuffix(SECTION, '');

  type IntersectionEntry = { isIntersecting: boolean };
  let observers: MockIntersectionObserver[] = [];

  class MockIntersectionObserver {
    private readonly callback: (entries: IntersectionEntry[]) => void;

    constructor(callback: (entries: IntersectionEntry[]) => void) {
      this.callback = callback;
      observers.push(this);
    }

    observe(): void {}
    disconnect(): void {}

    enter(isIntersecting = true): void {
      act(() => this.callback([{ isIntersecting }]));
    }
  }

  beforeEach(() => {
    observers = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.location.hash = '';
  });

  function renderExpandedOffScreen() {
    const jotaiStore = createStore();
    jotaiStore.set(globalStoreAtom, {
      items: [],
      store: emptyStore,
      options: normalizeOptions({ specType: 'openapi', downloadUrls: [], metadata: {} }),
      replayDefinition: null,
    });
    jotaiStore.set(itemStoreAtom(ITEM_ID), { expandableSections: { [BASELINE_KEY]: true } });

    return render(
      <MemoryRouter initialEntries={[{ pathname: ITEM_ID, hash: '' }]}>
        <Provider store={jotaiStore}>
          <ItemIdContext.Provider value={ITEM_ID}>
            <DeepLinkSectionContext.Provider value={SECTION}>
              <CollapsibleNestedFields
                level={2}
                property={stubProperty}
                fieldPath="body"
                expandByDefault={false}
              >
                <div data-testid="nested-content">nested children</div>
              </CollapsibleNestedFields>
            </DeepLinkSectionContext.Provider>
          </ItemIdContext.Provider>
        </Provider>
      </MemoryRouter>,
    );
  }

  it('renders a placeholder (not the children) when expanded off-screen, then mounts on intersect', () => {
    renderExpandedOffScreen();
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
    expect(observers).toHaveLength(1);

    observers[0].enter(true);
    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
  });

  it('keeps the placeholder while the observer reports not-intersecting', () => {
    renderExpandedOffScreen();
    observers[0].enter(false);
    expect(screen.queryByTestId('nested-content')).not.toBeInTheDocument();
  });

  it('force-mounts children immediately for a deep-link target, without observing', () => {
    const hash = '#op/t=request&path=body/name';
    window.location.hash = hash;
    render(
      <MemoryRouter initialEntries={[{ pathname: '/op', hash }]}>
        <CollapsibleNestedFields
          level={2}
          property={stubProperty}
          fieldPath="body"
          expandByDefault={false}
        >
          <div data-testid="nested-content">nested children</div>
        </CollapsibleNestedFields>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('nested-content')).toBeInTheDocument();
    expect(observers).toHaveLength(0);
  });
});
