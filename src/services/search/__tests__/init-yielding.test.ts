import { describe, expect, it, vi } from 'vitest';

import type { ApiItem, ApiStore } from '../../../types/store.js';

import { contentType } from '../../../types/common.js';
import { initializeSearch } from '../init.js';

function makeItems(count: number): ApiItem[] {
  return Array.from({ length: count }, (_, i) => ({
    type: 'link',
    label: `Operation ${i}`,
    link: `/docs/op-${i}`,
    content: { contentType: contentType.ITEM, children: [] },
  })) as unknown as ApiItem[];
}

const STORE = { schemaStore: {} } as unknown as ApiStore;

describe('initializeSearch yielding', () => {
  it('yields on a time budget rather than once per fixed batch', async () => {
    const timeout = vi.spyOn(globalThis, 'setTimeout');
    timeout.mockClear();

    await initializeSearch(makeItems(200), STORE, '/docs');

    // 200 items indexed and added take well under one 8ms budget on any machine that can
    // run the suite; the old fixed batch spent 40 clamped timers getting there.
    expect(timeout.mock.calls.length).toBeLessThan(10);
    timeout.mockRestore();
  });

  it('still indexes every item', async () => {
    const api = await initializeSearch(makeItems(50), STORE, '/docs');

    expect((await api.search('Operation 7'))[0]?.document.url).toBe('/docs/op-7');
  });
});
