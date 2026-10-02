import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router';

import type { RawApiDocsOptions } from '../../../types/options.js';

import { StoreProvider } from '../../../hoc/withStoreProvider.js';
import { MarkdownAdapterProvider } from '../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../markdoc/markdocAdapter.js';
import { buildGraphqlStoreFromSdl } from '../../../adapters/graphql/buildStoreFromSdl.js';
import { GraphQLTypeViewByName } from '../GraphQLTypeView.js';

const SDL = `
  """A registered user."""
  type User {
    """The user's unique id."""
    id: ID!
    name: String
    legacyName: String @deprecated(reason: "Use name instead.")
  }
`;

function renderCatalogTypeView(typeName: string) {
  return render(
    <MemoryRouter>
      <StoreProvider
        apiStore={buildGraphqlStoreFromSdl(SDL)}
        options={{ specType: 'graphql' } as RawApiDocsOptions}
      >
        <MarkdownAdapterProvider value={createMarkdocAdapter()}>
          <GraphQLTypeViewByName typeName={typeName} fieldExpandLevel={0} />
        </MarkdownAdapterProvider>
      </StoreProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
});

describe('catalog GraphQL type preview wiring', () => {
  it('resolves the type from the store document and renders its fields', () => {
    renderCatalogTypeView('User');

    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('legacyName')).toBeInTheDocument();
  });

  it('renders nothing when the type name is not in the schema', () => {
    const { container } = renderCatalogTypeView('DoesNotExist');
    expect(container).toBeEmptyDOMElement();
  });
});
