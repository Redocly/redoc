import { atom, Provider } from 'jotai';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

import type { ItemContentNode } from '../../../../types/content.js';
import { MarkdownAdapterProvider } from '../../../../contexts/markdownAdapter.js';
import { createMarkdocAdapter } from '../../../markdoc/markdocAdapter.js';

const getDirective = vi.fn();
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
      cached(`op:${key}`, () => makeAtom(() => (key ? getOperation(key) : null))),
    graphqlDirectiveDataAtom: (name: string) =>
      cached(`directive:${name}`, () => makeAtom(() => (name ? getDirective(name) : undefined))),
    graphqlTypeLookupAtom: makeAtom(() => () => undefined),
  };
});
vi.mock('../../../../jotai/store.js', () => ({
  globalOptionsAtom: atom({ fieldExpandLevel: 1 }),
}));

const isGraphqlFieldExpandable = vi.fn();
vi.mock('../../../../utils/graphql-type-expansion.js', () => ({
  isGraphqlFieldExpandable: (...args: unknown[]) => isGraphqlFieldExpandable(...args),
}));

const useExpandableSection = vi.fn();
vi.mock('../../../../hooks/useExpandableSection.js', () => ({
  useExpandableSection: (...args: unknown[]) => useExpandableSection(...args),
  useCollapsibleEntryKey: vi.fn(),
  useRegisterCollapsibleEntry: vi.fn(),
}));

vi.mock('../../../../hooks/useTranslate.js', () => ({
  useSpecTranslate: () => (_key: string, fallback: string) => fallback,
}));

vi.mock('../../../../adapters/utils/parseMarkdown.js', () => ({
  parseMarkdown: (value: string) => value,
}));

vi.mock('../../renderDescription.js', () => ({
  renderDescription: (d: unknown) => <span>{String(d)}</span>,
}));

vi.mock('../../GraphQLFieldView.js', () => ({
  GraphQLFieldView: ({
    field,
    parentTypeName,
    expanded,
  }: {
    field: { name: string };
    parentTypeName?: string;
    expanded?: boolean;
  }) => (
    <div
      data-testid="field-view"
      data-name={field.name}
      data-parent={parentTypeName ?? ''}
      data-override={String(expanded)}
    />
  ),
}));

import { GraphQLArgsSection } from '../GraphQLArgsSection.js';

function renderWithMarkdownAdapter(node: ItemContentNode) {
  return render(
    <Provider>
      <MarkdownAdapterProvider value={createMarkdocAdapter()}>
        <GraphQLArgsSection node={node} />
      </MarkdownAdapterProvider>
    </Provider>,
  );
}

const opNode = {
  nodeType: 'item',
  variant: 'graphql-args',
  graphqlOperationType: 'query',
  graphqlFieldName: 'users',
} as unknown as ItemContentNode;

beforeEach(() => {
  getDirective.mockReset().mockReturnValue(undefined);
  getOperation.mockReset().mockReturnValue(null);
  isGraphqlFieldExpandable.mockReset().mockReturnValue(false);
  useExpandableSection.mockReset().mockReturnValue(undefined);
});

afterEach(() => {
  cleanup();
});

describe('GraphQLArgsSection', () => {
  it('renders one field per operation argument, parented to the field name', () => {
    getOperation.mockReturnValue({ args: [{ name: 'first' }, { name: 'after' }] });
    renderWithMarkdownAdapter(opNode);

    const views = screen.getAllByTestId('field-view');
    expect(views.map((v) => v.getAttribute('data-name'))).toEqual(['first', 'after']);
    expect(views.every((v) => v.getAttribute('data-parent') === 'users')).toBe(true);
  });

  it('falls back to directive arguments when there is no operation', () => {
    getDirective.mockReturnValue({ name: 'deprecated', args: [{ name: 'reason' }] });
    renderWithMarkdownAdapter({
      nodeType: 'item',
      variant: 'graphql-args',
      graphqlTypeName: 'deprecated',
    } as unknown as ItemContentNode);

    const view = screen.getByTestId('field-view');
    expect(view).toHaveAttribute('data-name', 'reason');
    expect(view).toHaveAttribute('data-parent', '@deprecated');
  });

  it('falls back to the precomputed graphqlSchema args when nothing resolves', () => {
    renderWithMarkdownAdapter({
      nodeType: 'item',
      variant: 'graphql-args',
      graphqlSchema: [{ name: 'limit', type: 'Int' }],
    } as unknown as ItemContentNode);

    expect(screen.queryByTestId('field-view')).not.toBeInTheDocument();
    expect(screen.getByText('limit')).toBeInTheDocument();
    expect(screen.getByText('Int')).toBeInTheDocument();
  });

  it('renders deprecation admonition', () => {
    renderWithMarkdownAdapter({
      nodeType: 'item',
      variant: 'graphql-args',
      graphqlSchema: [
        {
          name: 'format',
          type: 'String',
          deprecationReason: 'Use getBookV2.format instead.',
        },
      ],
    } as unknown as ItemContentNode);

    expect(screen.getByText('Deprecation reason')).toBeInTheDocument();
    expect(screen.getByText('Use getBookV2.format instead.')).toBeInTheDocument();
  });

  it('renders nothing when there are no args from any source', () => {
    const { container } = renderWithMarkdownAdapter({
      nodeType: 'item',
      variant: 'graphql-args',
    } as unknown as ItemContentNode);
    expect(container).toBeEmptyDOMElement();
  });

  it('registers as expandable only when at least one arg is expandable', () => {
    getOperation.mockReturnValue({ args: [{ name: 'first' }, { name: 'after' }] });

    isGraphqlFieldExpandable.mockReturnValue(false);
    const { unmount } = renderWithMarkdownAdapter(opNode);
    expect(useExpandableSection).toHaveBeenLastCalledWith('graphql-args', false);
    unmount();

    isGraphqlFieldExpandable.mockImplementation((arg: { name: string }) => arg.name === 'after');
    renderWithMarkdownAdapter(opNode);
    expect(useExpandableSection).toHaveBeenLastCalledWith('graphql-args', true);
  });

  it('forwards the expand-all override to each field', () => {
    getOperation.mockReturnValue({ args: [{ name: 'first' }] });
    useExpandableSection.mockReturnValue(true);
    renderWithMarkdownAdapter(opNode);
    expect(screen.getByTestId('field-view')).toHaveAttribute('data-override', 'true');
  });
});
