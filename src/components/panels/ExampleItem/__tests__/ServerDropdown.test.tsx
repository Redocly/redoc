import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import '@testing-library/jest-dom/vitest';

import type { ServerEntry } from '../ServerDropdown.js';

import { ServerDropdown } from '../ServerDropdown.js';
import { appStore, environmentAtom, environmentsAtom } from '../../../../jotai/app.js';

const SERVERS: ServerEntry[] = [
  { url: 'https://rest.test.example.com', description: 'Test env' },
  { url: 'https://rest.prod.example.com', description: 'Prod env' },
];

const VAR_SERVERS: ServerEntry[] = [
  {
    url: 'https://{region}.vars.example.com',
    variables: { region: { default: 'eu' } },
  },
  { url: 'https://rest.prod.example.com', description: 'Prod env' },
];

function renderDropdown(servers: ServerEntry[], store = createStore()) {
  const utils = render(
    <Provider store={store}>
      <ServerDropdown servers={servers} method="get" path="/pets" />
    </Provider>,
  );
  return { store, ...utils };
}

function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: /get/i }));
}

beforeEach(() => {
  document.cookie = 'redoc.appStore=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  sessionStorage.clear();
});

describe('ServerDropdown', () => {
  it('renders the dropdown for a single server so its url stays visible', () => {
    renderDropdown([SERVERS[0]]);

    openMenu();

    expect(screen.getByText('Test env')).toBeInTheDocument();
    expect(screen.getByText('https://rest.test.example.com/pets')).toBeInTheDocument();
  });

  it('selecting the only server does not override the environment', () => {
    const { store } = renderDropdown([SERVERS[0]]);
    const [, seededName] = store.get(environmentAtom);

    openMenu();
    fireEvent.click(screen.getByText('Test env'));

    const [, envName] = store.get(environmentAtom);
    expect(envName).toBe(seededName);
  });

  it('renders a static path when there are no servers', () => {
    renderDropdown([]);

    expect(screen.queryByRole('button', { name: /get/i })).toBeNull();
    expect(screen.getByText('/pets')).toBeInTheDocument();
  });

  it('selecting a server stores the env under its display name with the raw server url', () => {
    const { store } = renderDropdown(SERVERS);

    openMenu();
    fireEvent.click(screen.getByText('Prod env'));

    const [env, envName] = store.get(environmentAtom);
    expect(envName).toBe('Prod env');
    expect(env.server).toBe('https://rest.prod.example.com');
  });

  it('does not clobber a saved selection on mount when environments are seeded', () => {
    const store = createStore();
    store.set(environmentAtom, {
      environment: 'Prod env',
      environments: {
        'Test env': { server: 'https://rest.test.example.com' },
        'Prod env': { server: 'https://rest.prod.example.com' },
      },
    });

    renderDropdown(SERVERS, store);

    const [env, envName] = store.get(environmentAtom);
    expect(envName).toBe('Prod env');
    expect(env.server).toBe('https://rest.prod.example.com');
  });

  it('keeps a saved environment name on mount even when its values are not yet seeded', () => {
    // Fresh session: the cookie still knows the env name while sessionStorage
    // (env values) is gone. The mount fallback may seed the first server's
    // values but must not overwrite the saved name.
    const store = createStore();
    store.set(environmentAtom, { environment: 'Prod env' });

    renderDropdown(SERVERS, store);

    const [env, envName] = store.get(environmentAtom);
    expect(store.get(environmentsAtom)['Prod env']).toEqual({
      server: 'https://rest.prod.example.com',
    });
    expect(envName).toBe('Prod env');
    expect(env.server).toBe('https://rest.prod.example.com');
  });

  it('keeps a saved name that matches none of its servers, resolving display via the getter fallback', () => {
    const store = createStore();
    store.set(environmentAtom, { environment: 'Other api env' });

    renderDropdown(SERVERS, store);

    const [env, envName] = store.get(environmentAtom);
    // Display resolves to the seeded fallback server…
    expect(envName).toBe('Test env');
    expect(env.server).toBe('https://rest.test.example.com');
    // …while the persisted name stays untouched for the api it belongs to.
    expect(store.get(appStore).environment).toBe('Other api env');
  });
});
