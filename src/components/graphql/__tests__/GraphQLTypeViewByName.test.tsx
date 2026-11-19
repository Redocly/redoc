import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import { options, renderWithFixture } from '../../__tests__/harness.js';
import { buildGraphqlStoreFromSdl } from '../../../adapters/graphql/buildStoreFromSdl.js';
import { GraphQLTypeViewByName } from '../GraphQLTypeView.js';

/** A store built straight from SDL, as embedding hosts do, without running the GraphQL adapter. */
function sdlStoreFixture(sdl: string, overrides: Record<string, unknown> = {}) {
  return {
    items: [],
    store: buildGraphqlStoreFromSdl(sdl),
    options: options('graphql', overrides),
  };
}

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
  return renderWithFixture(
    <GraphQLTypeViewByName typeName={typeName} fieldExpandLevel={0} />,
    sdlStoreFixture(SDL),
  );
}

afterEach(() => {
  cleanup();
});

describe('GraphQLTypeViewByName', () => {
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

const VARIANTS_SDL = `
  enum Color {
    RED
    GREEN
  }

  union SearchResult = Book | Author

  type Book {
    title: String
  }

  type Author {
    penName: String
  }

  input NewBook {
    isbn: String
  }

  interface Node {
    nodeId: ID
  }

  """A **point** in time."""
  scalar DateTime

  scalar Opaque

  type Library {
    address: Address
  }

  type Address {
    zipCode: String
  }
`;

function renderVariant(typeName: string, fieldExpandLevel = 0) {
  return renderWithFixture(
    <GraphQLTypeViewByName typeName={typeName} fieldExpandLevel={fieldExpandLevel} />,
    sdlStoreFixture(VARIANTS_SDL, { fieldExpandLevel: 1, schemasExpansionLevel: 2 }),
  );
}

describe('GraphQLTypeViewByName variants', () => {
  it('renders enum values', () => {
    renderVariant('Color');

    expect(screen.getByText('RED')).toBeInTheDocument();
    expect(screen.getByText('GREEN')).toBeInTheDocument();
  });

  it('renders union member type names', () => {
    renderVariant('SearchResult');

    expect(screen.getByText('Book')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
  });

  it('renders input fields', () => {
    renderVariant('NewBook');

    expect(screen.getByText('isbn')).toBeInTheDocument();
  });

  it('renders interface fields', () => {
    renderVariant('Node');

    expect(screen.getByText('nodeId')).toBeInTheDocument();
  });

  it('renders a scalar description as markdown', () => {
    const { container } = renderVariant('DateTime');

    expect(container.querySelector('strong')).toHaveTextContent('point');
  });

  it('renders an empty container for a scalar without a description', () => {
    const { container } = renderVariant('Opaque');

    expect(container).toBeEmptyDOMElement();
  });

  it('shows nested fields below the max field-expand depth and hides them at it', () => {
    renderVariant('Library', 0);
    expect(screen.getByText('address')).toBeInTheDocument();
    expect(screen.getByText('zipCode')).toBeInTheDocument();
    cleanup();

    renderVariant('Library', 1);
    expect(screen.getByText('address')).toBeInTheDocument();
    expect(screen.queryByText('zipCode')).not.toBeInTheDocument();
  });
});
