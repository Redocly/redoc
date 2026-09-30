import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore } from 'jotai';

import {
  buildVariantStateKey,
  expandableSectionAtom,
  expandableSectionKeysAtom,
  itemStoreAtom,
  itemStoreFieldAtom,
} from '../itemStore.js';
import { keepReadingSectionAnchored } from '../../utils/scroll-anchoring.js';

vi.mock('../../utils/scroll-anchoring.js', () => ({
  keepReadingSectionAnchored: vi.fn(),
}));

const ITEM_ID = 'op-getPet';
const OTHER_ITEM_ID = 'op-listPets';

describe('itemStoreFieldAtom', () => {
  it('returns the default value for an uninitialized item', () => {
    const store = createStore();
    const codeAtom = itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' });
    expect(store.get(codeAtom)).toBe('');
  });

  it('returns identical atom references for identical params', () => {
    const a = itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' });
    const b = itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' });
    expect(a).toBe(b);
  });

  it('returns different atoms for different keys or items', () => {
    const responseCodeAtom = itemStoreFieldAtom({
      itemId: ITEM_ID,
      key: 'activeResponseCode',
    });
    const discriminatorAtom = itemStoreFieldAtom({
      itemId: ITEM_ID,
      key: 'activeDiscriminator',
    });
    const otherItemAtom = itemStoreFieldAtom({
      itemId: OTHER_ITEM_ID,
      key: 'activeResponseCode',
    });
    expect(responseCodeAtom).not.toBe(discriminatorAtom);
    expect(responseCodeAtom).not.toBe(otherItemAtom);
  });

  it('reflects updates made through the writable item store atom', () => {
    const store = createStore();
    const codeAtom = itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' });

    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '200' });

    expect(store.get(codeAtom)).toBe('200');
  });

  it('does not notify subscribers of unrelated keys', () => {
    const store = createStore();
    const codeAtom = itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' });
    const discriminatorAtom = itemStoreFieldAtom({
      itemId: ITEM_ID,
      key: 'activeDiscriminator',
    });

    const codeListener = vi.fn();
    const discListener = vi.fn();
    const unsubCode = store.sub(codeAtom, codeListener);
    const unsubDisc = store.sub(discriminatorAtom, discListener);

    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '404' });

    expect(codeListener).toHaveBeenCalledTimes(1);
    expect(discListener).not.toHaveBeenCalled();

    store.set(itemStoreAtom(ITEM_ID), (prev) => ({
      activeDiscriminator: { ...prev.activeDiscriminator, foo: 1 },
    }));

    expect(codeListener).toHaveBeenCalledTimes(1);
    expect(discListener).toHaveBeenCalledTimes(1);

    unsubCode();
    unsubDisc();
  });

  it('does not notify subscribers when an unrelated item is updated', () => {
    const store = createStore();
    const codeAtom = itemStoreFieldAtom({ itemId: ITEM_ID, key: 'activeResponseCode' });
    const listener = vi.fn();
    const unsub = store.sub(codeAtom, listener);

    store.set(itemStoreAtom(OTHER_ITEM_ID), { activeResponseCode: '500' });

    expect(listener).not.toHaveBeenCalled();
    unsub();
  });
});

describe('itemStoreAtom scroll anchoring', () => {
  beforeEach(() => {
    vi.mocked(keepReadingSectionAnchored).mockClear();
  });

  it('anchors on writes that swap rendered content (response code, oneOf)', () => {
    const store = createStore();

    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '401' });
    expect(keepReadingSectionAnchored).toHaveBeenCalledTimes(1);

    store.set(itemStoreAtom(ITEM_ID), (prev) => ({
      activeOneOf: { ...prev.activeOneOf, 'body/One of:': 1 },
    }));
    expect(keepReadingSectionAnchored).toHaveBeenCalledTimes(2);
  });

  it('does not anchor when the written value is unchanged', () => {
    const store = createStore();
    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '401' });
    vi.mocked(keepReadingSectionAnchored).mockClear();

    store.set(itemStoreAtom(ITEM_ID), { activeResponseCode: '401' });

    expect(keepReadingSectionAnchored).not.toHaveBeenCalled();
  });

  it('does not anchor on mount-driven bookkeeping writes', () => {
    const store = createStore();

    store.set(itemStoreAtom(ITEM_ID), (prev) => ({
      expandableSections: { ...prev.expandableSections, 'response:200': true },
    }));
    store.set(itemStoreAtom(ITEM_ID), (prev) => ({
      collapsibles: { ...prev.collapsibles, 'response:200#:r1:': true },
    }));

    expect(keepReadingSectionAnchored).not.toHaveBeenCalled();
  });
});

describe('buildVariantStateKey', () => {
  it('returns the localPart unchanged for a root axis (undefined parents)', () => {
    expect(buildVariantStateKey(undefined, 'One of:')).toBe('One of:');
  });

  it('returns the localPart unchanged for a root axis (empty parents)', () => {
    expect(buildVariantStateKey([], 'itemType')).toBe('itemType');
  });

  it('joins a single-segment parent path with /', () => {
    expect(buildVariantStateKey(['entityMetadata'], 'One of:')).toBe('entityMetadata/One of:');
  });

  it('joins a multi-segment parent path with /', () => {
    expect(buildVariantStateKey(['payment', 'method'], 'kind')).toBe('payment/method/kind');
  });

  it('preserves array-item suffix on the last segment', () => {
    expect(buildVariantStateKey(['tripFilters[]'], 'filterType')).toBe('tripFilters[]/filterType');
  });

  it('does not mutate the input array', () => {
    const path = ['a', 'b'];
    buildVariantStateKey(path, 'kind');
    expect(path).toEqual(['a', 'b']);
  });
});

describe('expandableSectionAtom', () => {
  const KEY = `${ITEM_ID}:response:200`;

  it('returns undefined when the key has never been registered', () => {
    const store = createStore();
    const value = store.get(expandableSectionAtom(ITEM_ID, KEY));
    expect(value).toBeUndefined();
  });

  it('reflects the stored value for that key', () => {
    const store = createStore();
    store.set(itemStoreAtom(ITEM_ID), {
      expandableSections: { [KEY]: true },
    });
    expect(store.get(expandableSectionAtom(ITEM_ID, KEY))).toBe(true);
  });

  it('returns identical atom references for identical params', () => {
    const a = expandableSectionAtom(ITEM_ID, KEY);
    const b = expandableSectionAtom(ITEM_ID, KEY);
    expect(a).toBe(b);
  });

  it('does not notify subscribers when an unrelated key changes', () => {
    const store = createStore();
    const otherKey = `${ITEM_ID}:request:application/json`;
    const listener = vi.fn();
    const unsub = store.sub(expandableSectionAtom(ITEM_ID, KEY), listener);

    store.set(itemStoreAtom(ITEM_ID), {
      expandableSections: { [otherKey]: true },
    });

    expect(listener).not.toHaveBeenCalled();
    unsub();
  });
});

describe('expandableSectionKeysAtom', () => {
  it('returns an empty list when no sections are registered', () => {
    const store = createStore();
    expect(store.get(expandableSectionKeysAtom(ITEM_ID))).toEqual([]);
  });

  it('returns the keys of expandableSections', () => {
    const store = createStore();
    const k1 = `${ITEM_ID}:response:200`;
    const k2 = `${ITEM_ID}:request:application/json`;
    store.set(itemStoreAtom(ITEM_ID), {
      expandableSections: { [k1]: true, [k2]: undefined },
    });
    const result = store.get(expandableSectionKeysAtom(ITEM_ID));
    expect(result).toContain(k1);
    expect(result).toContain(k2);
    expect(result).toHaveLength(2);
  });

  it('does not notify subscribers when only a value flips', () => {
    const store = createStore();
    const key = `${ITEM_ID}:response:200`;
    store.set(itemStoreAtom(ITEM_ID), { expandableSections: { [key]: undefined } });

    const listener = vi.fn();
    const unsub = store.sub(expandableSectionKeysAtom(ITEM_ID), listener);

    store.set(itemStoreAtom(ITEM_ID), { expandableSections: { [key]: true } });
    store.set(itemStoreAtom(ITEM_ID), { expandableSections: { [key]: false } });

    expect(listener).not.toHaveBeenCalled();
    unsub();
  });

  it('does notify subscribers when a key is added or removed', () => {
    const store = createStore();
    const k1 = `${ITEM_ID}:response:200`;
    const k2 = `${ITEM_ID}:request:application/json`;
    store.set(itemStoreAtom(ITEM_ID), { expandableSections: { [k1]: undefined } });

    const listener = vi.fn();
    const unsub = store.sub(expandableSectionKeysAtom(ITEM_ID), listener);

    store.set(itemStoreAtom(ITEM_ID), {
      expandableSections: { [k1]: undefined, [k2]: undefined },
    });
    expect(listener).toHaveBeenCalledTimes(1);

    store.set(itemStoreAtom(ITEM_ID), { expandableSections: { [k1]: undefined } });
    expect(listener).toHaveBeenCalledTimes(2);

    unsub();
  });
});
