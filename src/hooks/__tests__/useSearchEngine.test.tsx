import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';

import type { ApiItem, ApiStore } from '../../types/store.js';

import { contentType } from '../../types/common.js';
import { useSearchEngine } from '../useSearchEngine.js';

const ITEMS = [
  {
    type: 'link',
    label: 'List orders',
    link: '/docs/listorders',
    content: { contentType: contentType.ITEM, children: [] },
  },
] as unknown as ApiItem[];

const STORE = { schemaStore: {} } as unknown as ApiStore;

type IdleWindow = Window & {
  requestIdleCallback?: (task: () => void) => number;
  cancelIdleCallback?: (handle: number) => void;
};

let idleTasks: Array<() => void>;
let originals: Pick<IdleWindow, 'requestIdleCallback' | 'cancelIdleCallback'>;

/** jsdom may or may not implement the idle callbacks, so drive them by hand either way. */
function stubIdle(
  request: IdleWindow['requestIdleCallback'],
  cancel: IdleWindow['cancelIdleCallback'],
): void {
  (window as IdleWindow).requestIdleCallback = request;
  (window as IdleWindow).cancelIdleCallback = cancel;
}

beforeEach(() => {
  const w = window as IdleWindow;
  originals = {
    requestIdleCallback: w.requestIdleCallback,
    cancelIdleCallback: w.cancelIdleCallback,
  };
  idleTasks = [];
  stubIdle(
    (task) => idleTasks.push(task),
    (handle) => {
      idleTasks[handle - 1] = () => {};
    },
  );
});

afterEach(() => {
  // Unmount while the stubs are still installed: the hook cancels its idle task on teardown.
  cleanup();
  stubIdle(originals.requestIdleCallback, originals.cancelIdleCallback);
  vi.restoreAllMocks();
});

function render() {
  return renderHook(() => useSearchEngine(ITEMS, STORE, '/docs'));
}

describe('useSearchEngine', () => {
  it('defers the build to idle rather than running it during load', async () => {
    const { result } = render();

    expect(idleTasks).toHaveLength(1);
    expect(result.current.isReady).toBe(false);
    expect(await result.current.search('orders')).toEqual([]);
  });

  it('builds when idle comes around, with no interaction at all', async () => {
    const { result } = render();

    await act(async () => {
      idleTasks[0]();
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(await result.current.search('orders')).toHaveLength(1);
  });

  it('pulls the build forward for a reader who opens search before idle', async () => {
    const { result } = render();

    await act(async () => {
      result.current.ensureIndex();
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(await result.current.search('orders')).toHaveLength(1);
  });

  it('builds once when idle fires after an early open', async () => {
    const { result } = render();

    await act(async () => {
      result.current.ensureIndex();
      result.current.ensureIndex();
      idleTasks[0]();
    });

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(await result.current.search('orders')).toHaveLength(1);
  });

  it('cancels the idle task when it unmounts before building', () => {
    const cancel = vi.fn();
    stubIdle(() => 7, cancel);

    render().unmount();

    expect(cancel).toHaveBeenCalledWith(7);
  });
});
