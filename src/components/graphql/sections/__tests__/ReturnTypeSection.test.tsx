import { atom, Provider } from 'jotai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../../types/content.js';

const getOperation = vi.fn();
vi.mock('../../../../jotai/graphql.js', async () => {
  const { atom: makeAtom } = await import('jotai');
  const cachedAtoms = new Map<string, unknown>();
  const cached = (cacheKey: string, create: () => unknown) => {
    if (!cachedAtoms.has(cacheKey)) cachedAtoms.set(cacheKey, create());
    return cachedAtoms.get(cacheKey);
  };
  return {
    graphqlOperationKey: (type?: string, name?: string) => (type && name ? `${type}:${name}` : ''),
    graphqlOperationAtom: (key: string) =>
      cached(`op:${key}`, () => makeAtom(() => (key ? getOperation(key) : undefined))),
    graphqlTypeDataAtom: (name: string) =>
      cached(`type:${name}`, () =>
        makeAtom(() => (name ? { name, variant: 'object' } : undefined)),
      ),
    graphqlTypeLookupAtom: makeAtom(() => () => undefined),
  };
});
vi.mock('../../../../jotai/store.js', () => ({
  globalOptionsAtom: atom({ fieldExpandLevel: 1 }),
}));

const graphqlTypeHasExpandableFields = vi.fn();
vi.mock('../../../../utils/graphql-type-expansion.js', () => ({
  graphqlTypeHasExpandableFields: (...args: unknown[]) => graphqlTypeHasExpandableFields(...args),
}));

const useExpandableSection = vi.fn();
const useCollapsibleEntryKey = vi.fn();
const useRegisterCollapsibleEntry = vi.fn();
vi.mock('../../../../hooks/useExpandableSection.js', () => ({
  useExpandableSection: (...args: unknown[]) => useExpandableSection(...args),
  useCollapsibleEntryKey: (...args: unknown[]) => useCollapsibleEntryKey(...args),
  useRegisterCollapsibleEntry: (...args: unknown[]) => useRegisterCollapsibleEntry(...args),
}));

vi.mock('../../GraphQLReturnTypeDetails.js', () => ({
  GraphQLReturnTypeDetails: () => <div data-testid="return-type-details" />,
}));
vi.mock('../../ArrowIcon.js', () => ({
  ArrowIcon: () => <span data-testid="arrow" />,
}));
vi.mock('../../GraphQLTypeView.js', () => ({
  GraphQLTypeViewByName: ({ expanded }: { expanded?: boolean }) => (
    <div data-testid="type-view" data-override={String(expanded)} />
  ),
}));

import { ReturnTypeSection } from '../ReturnTypeSection.js';

const baseNode = {
  nodeType: 'item',
  variant: 'return-type',
  graphqlTypeName: 'Person',
  graphqlOperationType: 'query',
  graphqlFieldName: 'hero',
} as unknown as ItemContentNode;

function renderInRouter(ui: ReactElement, hash = '') {
  return render(
    <Provider>
      <MemoryRouter initialEntries={[{ pathname: '/', hash }]}>{ui}</MemoryRouter>
    </Provider>,
  );
}

beforeEach(() => {
  getOperation.mockReset();
  graphqlTypeHasExpandableFields.mockReset().mockReturnValue(true);
  useExpandableSection.mockReset().mockReturnValue(undefined);
  useCollapsibleEntryKey.mockReset().mockImplementation((sectionKey?: string) => sectionKey);
  useRegisterCollapsibleEntry.mockReset();
});

afterEach(() => {
  cleanup();
});

describe('ReturnTypeSection', () => {
  it('renders nothing when the node has no type name and no resolvable operation', () => {
    const { container } = renderInRouter(
      <ReturnTypeSection
        node={{ nodeType: 'item', variant: 'return-type' } as unknown as ItemContentNode}
      />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(getOperation).not.toHaveBeenCalled();
  });

  it('renders the arrow, return-type details, and the fields inline when the operation resolves', () => {
    getOperation.mockReturnValue({ type: {} });
    renderInRouter(<ReturnTypeSection node={baseNode} />);
    expect(screen.getByTestId('arrow')).toBeInTheDocument();
    expect(screen.getByTestId('return-type-details')).toBeInTheDocument();
    expect(screen.getByTestId('type-view')).toBeInTheDocument();
  });

  it('forwards the expand-all override to the inline type view', () => {
    getOperation.mockReturnValue({ type: {} });
    useExpandableSection.mockReturnValue(true);
    renderInRouter(<ReturnTypeSection node={baseNode} />);
    expect(screen.getByTestId('type-view')).toHaveAttribute('data-override', 'true');
  });

  it('registers the section for expand-all when the type has expandable fields', () => {
    getOperation.mockReturnValue({ type: {} });
    graphqlTypeHasExpandableFields.mockReturnValue(true);
    renderInRouter(<ReturnTypeSection node={baseNode} />);
    expect(useExpandableSection).toHaveBeenCalledWith('return-type', true);
    expect(useCollapsibleEntryKey).toHaveBeenCalledWith('return-type');
    expect(useRegisterCollapsibleEntry).toHaveBeenCalledWith('return-type', false);
  });

  it('does not register a rendered collapsible when the type has no expandable fields', () => {
    getOperation.mockReturnValue({ type: {} });
    graphqlTypeHasExpandableFields.mockReturnValue(false);
    renderInRouter(<ReturnTypeSection node={baseNode} />);
    expect(useCollapsibleEntryKey).toHaveBeenCalledWith(undefined);
    expect(useRegisterCollapsibleEntry).toHaveBeenCalledWith(undefined, false);
  });

  it('falls back to a bare type view (no arrow) when the operation cannot be resolved', () => {
    getOperation.mockReturnValue(undefined);
    useExpandableSection.mockReturnValue(true);
    renderInRouter(
      <ReturnTypeSection
        node={
          {
            nodeType: 'item',
            variant: 'return-type',
            graphqlTypeName: 'Person',
          } as unknown as ItemContentNode
        }
      />,
    );
    expect(screen.queryByTestId('arrow')).not.toBeInTheDocument();
    const view = screen.getByTestId('type-view');
    expect(view).toBeInTheDocument();
    expect(view).toHaveAttribute('data-override', 'true');
  });
});
