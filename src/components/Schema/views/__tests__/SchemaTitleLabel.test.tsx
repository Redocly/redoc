import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { createStore, Provider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { GlobalStoreAtom } from '../../../../jotai/store.js';
import type { ApiDocsOptions } from '../../../../types/options.js';
import type { ApiItem } from '../../../../types/store.js';

import { globalStoreAtom } from '../../../../jotai/store.js';
import { SchemaTitleLabel } from '../SchemaTitleLabel.js';

const ITEMS = [
  { httpVerb: 'schema', routeSlug: '/schemas/pet', content: { meta: { name: 'Pet' } } },
] as unknown as ApiItem[];

function renderLabel(
  props: { title?: string; schemaName?: string },
  options?: Partial<ApiDocsOptions>,
) {
  const jotaiStore = createStore();
  jotaiStore.set(globalStoreAtom, {
    items: ITEMS,
    replayDefinition: null,
    store: { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} },
    options: { ...(options ?? {}) } as ApiDocsOptions,
  } as GlobalStoreAtom);

  return render(
    <Provider store={jotaiStore}>
      <MemoryRouter>
        <SchemaTitleLabel {...props} />
      </MemoryRouter>
    </Provider>,
  );
}

afterEach(cleanup);

describe('SchemaTitleLabel', () => {
  it('links to the schema page when schemaDefinitionsTagName is set and the schema has a page', () => {
    renderLabel({ title: 'Pet', schemaName: 'Pet' }, { schemaDefinitionsTagName: 'Schemas' });

    const link = screen.getByRole('link', { name: '(Pet)' });
    expect(link).toHaveAttribute('href', '/schemas/pet');
  });

  it('renders plain text (not a link) when schemaDefinitionsTagName is not set', () => {
    renderLabel({ title: 'Pet', schemaName: 'Pet' });

    expect(screen.getByText('(Pet)')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders plain text (not a link) when the schema has no definition page', () => {
    renderLabel({ title: 'Widget', schemaName: 'Widget' }, { schemaDefinitionsTagName: 'Schemas' });

    expect(screen.getByText('(Widget)')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders plain text (not a link) for an inline title with no referenced schema', () => {
    renderLabel({ title: 'CVV check' }, { schemaDefinitionsTagName: 'Schemas' });

    expect(screen.getByText('(CVV check)')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders nothing when hideSchemaTitles is true', () => {
    const { container } = renderLabel(
      { title: 'Pet', schemaName: 'Pet' },
      { schemaDefinitionsTagName: 'Schemas', hideSchemaTitles: true },
    );

    expect(screen.queryByText('(Pet)')).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});
