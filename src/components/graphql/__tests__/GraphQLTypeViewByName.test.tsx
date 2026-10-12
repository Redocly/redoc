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
    """Contact **email** address."""
    email: String
  }

  enum Role {
    """Full access, see \`scopes\`."""
    ADMIN
    VIEWER
  }
`;

function renderTypeView(typeName: string) {
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

describe('GraphQLTypeViewByName preview wiring', () => {
  it('resolves the type from the store document and renders its fields', () => {
    renderTypeView('User');

    expect(screen.getByText('id')).toBeInTheDocument();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('legacyName')).toBeInTheDocument();
  });

  it('renders markdown in field and enum value descriptions from the store', () => {
    const { container: typeContainer } = renderTypeView('User');
    expect(typeContainer.querySelector('strong')).toHaveTextContent('email');
    cleanup();

    const { container: enumContainer } = renderTypeView('Role');
    expect(enumContainer.querySelector('code')).toHaveTextContent('scopes');
  });

  it('renders nothing when the type name is not in the schema', () => {
    const { container } = renderTypeView('DoesNotExist');
    expect(container).toBeEmptyDOMElement();
  });
});
