/* tslint:disable:no-implicit-dependencies */
import * as React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { Redoc, RedocStandalone } from '../';
import { AppStore } from '../../services';

// jest falls back to the in-process search worker, which has no terminate()
const options = { disableSearch: true };

const spec = {
  openapi: '3.0.0',
  info: { title: 'Test', version: '1.0.0' },
  paths: {
    '/pets': {
      get: { operationId: 'listPets', responses: { '200': { description: 'OK' } } },
    },
  },
};

describe('Redoc scroll listeners', () => {
  const scrollListeners = new Set<EventListenerOrEventListenerObject>();
  let container: HTMLDivElement;
  let root: Root;

  beforeAll(() => {
    (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
  });

  beforeEach(() => {
    scrollListeners.clear();
    const addEventListener = window.addEventListener;
    const removeEventListener = window.removeEventListener;
    jest.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
      if (type === 'scroll') scrollListeners.add(listener);
      addEventListener.call(window, type, listener, options);
    });
    jest.spyOn(window, 'removeEventListener').mockImplementation((type, listener, options) => {
      if (type === 'scroll') scrollListeners.delete(listener);
      removeEventListener.call(window, type, listener, options);
    });
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    container.remove();
  });

  const scrollSubscribers = (store: AppStore) =>
    (store as any).scroll._emiter.listenerCount('scroll') as number;

  test('RedocStandalone removes every scroll listener on unmount in StrictMode', async () => {
    let loaded!: () => void;
    const onLoaded = new Promise<void>(resolve => (loaded = resolve));

    await act(async () => {
      root.render(
        <React.StrictMode>
          <RedocStandalone
            spec={spec}
            options={{ ...options, scrollYOffset: 50 }}
            onLoaded={() => loaded()}
          />
        </React.StrictMode>,
      );
    });
    await act(async () => {
      await onLoaded;
    });

    expect(scrollListeners.size).toBe(1);

    act(() => root.unmount());

    expect(scrollListeners.size).toBe(0);
  });

  test('Redoc keeps the scroll-spy of its store after a StrictMode remount', () => {
    const store = new AppStore(spec as any, undefined, options);

    act(() => {
      root.render(
        <React.StrictMode>
          <Redoc store={store} />
        </React.StrictMode>,
      );
    });

    expect(scrollListeners.size).toBe(1);
    expect(scrollSubscribers(store)).toBe(1);

    act(() => root.unmount());

    expect(scrollListeners.size).toBe(0);
  });

  test('Redoc disposes the previous store when it receives a new one', () => {
    const first = new AppStore(spec as any, undefined, options);
    const second = new AppStore(spec as any, undefined, options);

    act(() => root.render(<Redoc store={first} />));
    act(() => root.render(<Redoc store={second} />));

    expect(scrollListeners.size).toBe(1);
    expect(scrollSubscribers(first)).toBe(0);
    expect(scrollSubscribers(second)).toBe(1);

    act(() => root.unmount());

    expect(scrollListeners.size).toBe(0);
  });
});
