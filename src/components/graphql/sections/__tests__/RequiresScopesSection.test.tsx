import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ItemContentNode } from '../../../../types/content.js';
import type { Fixture } from '../../../__tests__/harness.js';

import { nodeTypes } from '../../../../types/common.js';
import { graphqlFixture, renderWithFixture } from '../../../__tests__/harness.js';
import { ItemContentRenderer } from '../../../ItemContent/ItemContentRenderer.js';

vi.mock('@redocly/theme/core/openapi', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  ...(await import('../../../__tests__/themeHooksMock.js')).themeHooksMock(),
}));

const SDL = `
  directive @requiresScopes(scopes: [[String!]!]!) on OBJECT | FIELD_DEFINITION | ENUM_VALUE

  type Query {
    account: Account @requiresScopes(scopes: [["account:read"]])
    ping: String
  }

  type Account @requiresScopes(scopes: [["type:read"]]) {
    id: ID
  }

  type Plain {
    id: ID
  }
`;

let fixture: Fixture;

beforeAll(() => {
  fixture = graphqlFixture(SDL);
});

afterEach(() => {
  cleanup();
});

function renderScopes(extra: Partial<ItemContentNode>) {
  const node = {
    nodeType: nodeTypes.ITEM,
    variant: 'requires-scopes',
    ...extra,
  } as ItemContentNode;
  return renderWithFixture(<ItemContentRenderer node={node} />, fixture);
}

function openScopes(): HTMLElement {
  fireEvent.click(screen.getByText('View details'));
  return screen.getByRole('dialog');
}

describe('RequiresScopesSection', () => {
  it("shows the field's scopes for an operation node", () => {
    renderScopes({
      graphqlTypeName: 'Query',
      graphqlFieldName: 'account',
      graphqlOperationType: 'query',
    });

    const dialog = openScopes();

    expect(within(dialog).getByText('account:read')).toBeInTheDocument();
    expect(within(dialog).queryByText('type:read')).not.toBeInTheDocument();
  });

  it("shows the type's scopes for a type node", () => {
    renderScopes({ graphqlTypeName: 'Account' });

    const dialog = openScopes();

    expect(within(dialog).getByText('type:read')).toBeInTheDocument();
    expect(within(dialog).queryByText('account:read')).not.toBeInTheDocument();
  });

  it('renders nothing without a type name', () => {
    const { container } = renderScopes({});

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when there is no directive', () => {
    const { container } = renderScopes({ graphqlTypeName: 'Plain' });

    expect(container).toBeEmptyDOMElement();
  });
});
