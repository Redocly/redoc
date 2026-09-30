import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { ApiItem, ApiStore } from '../../types/store.js';
import type { RawApiDocsOptions } from '../../types/options.js';

import { withStoreProvider } from '../withStoreProvider.js';
import { environmentAtom, environmentsAtom } from '../../jotai/app.js';

const NO_ITEMS: ApiItem[] = [];

function makeStore(servers?: ApiStore['servers']): ApiStore {
  return {
    schemaStore: {},
    exampleStore: {},
    securitySchemeStore: {},
    ...(servers && { servers }),
  };
}

const SERVERS: NonNullable<ApiStore['servers']> = [
  { url: 'https://rest.test.example.com', description: 'Test env' },
  { url: 'https://rest.prod.example.com', description: 'Prod env' },
  {
    url: 'https://{region}.vars.example.com',
    description: 'Vars env',
    variables: { region: { default: 'eu' } },
  },
];

const Wrapped = withStoreProvider(
  (() => null) as unknown as React.ComponentType<{
    items: ApiItem[];
    store: ApiStore;
    options: RawApiDocsOptions;
  }>,
);

function renderWithParentStore(apiStore: ApiStore) {
  const parentStore = createStore();
  render(
    <Provider store={parentStore}>
      <Wrapped items={NO_ITEMS} store={apiStore} options={{ specType: 'openapi' }} />
    </Provider>,
  );
  return parentStore;
}

beforeEach(() => {
  document.cookie = 'redoc.appStore=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  sessionStorage.clear();
});

describe('withStoreProvider server environment seeding', () => {
  it('seeds one environment per server, keyed like openapi-docs (description || url)', () => {
    const store = renderWithParentStore(makeStore(SERVERS));

    expect(store.get(environmentsAtom)).toEqual({
      'Test env': { server: 'https://rest.test.example.com' },
      'Prod env': { server: 'https://rest.prod.example.com' },
      'Vars env': { server: 'https://{region}.vars.example.com', region: 'eu' },
    });
  });

  it('seeds nothing when the store has no servers', () => {
    const store = renderWithParentStore(makeStore());
    expect(store.get(environmentsAtom)).toEqual({});
  });

  it('resolves a persisted environment name in a fresh session (cookie only, no sessionStorage)', () => {
    // The env name survives in the cookie while the env values (sessionStorage)
    // are gone — seeding must restore them so the saved selection sticks.
    document.cookie = `redoc.appStore=${encodeURIComponent(
      JSON.stringify({ environment: 'Prod env' }),
    )}; path=/`;

    const store = renderWithParentStore(makeStore(SERVERS));

    const [env, envName] = store.get(environmentAtom);
    expect(envName).toBe('Prod env');
    expect(env.server).toBe('https://rest.prod.example.com');
  });

  it('does not revert user-edited environment values when the effect re-runs', () => {
    // Regression: seeding runs inside a useEffect whose deps include `items`,
    // so an embedded parent re-render (new items identity) re-seeds. Seeding
    // must fill defaults only — never overwrite a value the user already edited.
    const parentStore = createStore();
    const apiStore = makeStore(SERVERS);

    const { rerender } = render(
      <Provider store={parentStore}>
        <Wrapped items={[]} store={apiStore} options={{ specType: 'openapi' }} />
      </Provider>,
    );

    // User switches to the templated server and edits its region default eu -> us.
    parentStore.set(environmentAtom, {
      environment: 'Vars env',
      environments: { 'Vars env': { region: 'us' } },
    });

    // Parent re-renders with a fresh `items` array identity -> effect re-runs -> re-seed.
    rerender(
      <Provider store={parentStore}>
        <Wrapped items={[]} store={apiStore} options={{ specType: 'openapi' }} />
      </Provider>,
    );

    expect(parentStore.get(environmentsAtom)['Vars env']).toEqual({
      server: 'https://{region}.vars.example.com',
      region: 'us',
    });
  });

  it('subscribes to appStore at most once per store across effect re-runs', () => {
    // Regression: seeding kept appStore mounted via `store.sub(...)` on every
    // invocation without ever unsubscribing — each embedded-parent re-render
    // stacked another permanent listener on the same store.
    const parentStore = createStore();
    const subSpy = vi.spyOn(parentStore, 'sub');
    const apiStore = makeStore(SERVERS);

    const { rerender } = render(
      <Provider store={parentStore}>
        <Wrapped items={[]} store={apiStore} options={{ specType: 'openapi' }} />
      </Provider>,
    );
    const subsAfterMount = subSpy.mock.calls.length;

    // Fresh `items` identities force the seeding effect to re-run twice.
    rerender(
      <Provider store={parentStore}>
        <Wrapped items={[]} store={apiStore} options={{ specType: 'openapi' }} />
      </Provider>,
    );
    rerender(
      <Provider store={parentStore}>
        <Wrapped items={[]} store={apiStore} options={{ specType: 'openapi' }} />
      </Provider>,
    );

    expect(subSpy.mock.calls.length).toBe(subsAfterMount);
  });
});
