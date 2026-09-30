import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';

import type { GlobalStoreAtom } from '../../../jotai/store.js';

import { globalStoreAtom } from '../../../jotai/store.js';
import { normalizeOptions } from '../../../options/normalizeOptions.js';
import { RequiredScopes } from '../RequiredScopes.js';

function createGlobalStore() {
  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: normalizeOptions({
      specType: 'openapi',
      downloadUrls: [],
      metadata: {},
      basePath: '',
    }),
  } as GlobalStoreAtom);
  return store;
}

function renderScopes(scopes: string[]) {
  return render(
    <JotaiProvider store={createGlobalStore()}>
      <RequiredScopes scopes={scopes} />
    </JotaiProvider>,
  );
}

describe('RequiredScopes', () => {
  it('renders all scopes inline when there are 4 or fewer', () => {
    renderScopes(['read', 'write', 'admin', 'audit']);
    expect(screen.getByText('read')).toBeInTheDocument();
    expect(screen.getByText('audit')).toBeInTheDocument();
    expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
  });

  it('caps at 4 inline scopes and shows a +N overflow chip for the rest', () => {
    renderScopes(['s1', 's2', 's3', 's4', 's5', 's6']);

    expect(screen.getByText('s1')).toBeInTheDocument();
    expect(screen.getByText('s4')).toBeInTheDocument();
    // hidden scopes are not rendered inline (only inside the overflow tooltip)
    expect(screen.queryByText('s5')).not.toBeInTheDocument();

    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show 2 more scopes' })).toBeInTheDocument();
  });

  it('renders nothing when there are no scopes', () => {
    const { container } = renderScopes([]);
    expect(container).toBeEmptyDOMElement();
  });
});
