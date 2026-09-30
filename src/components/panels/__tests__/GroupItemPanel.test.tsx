import { it, expect, vi, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { GroupItemNode, GroupItemsPanelItem } from '../../../types/content.js';
import type { ReactElement, ReactNode } from 'react';

import { GroupPanelItem } from '../GroupPanelItem.js';
import { panelKind } from '../../../types/common.js';

const mocks = vi.hoisted(() => ({
  normalizeUrl: vi.fn((href: string) => href),
}));

vi.mock('../../../hooks/useNormalizeUrl.js', () => ({
  useNavigationUrlNormalizer: () => mocks.normalizeUrl,
}));

const SPEC_TRANSLATIONS: Record<string, string> = {
  operations: 'Operationen',
};

vi.mock('../../../hooks/useTranslate.js', () => ({
  useSpecTranslate: () => (key: string, fallback?: string) =>
    SPEC_TRANSLATIONS[key] ?? fallback ?? key,
}));
vi.mock('@redocly/theme/components/Button/Button', () => ({
  // Stub Button to forward its `to` prop as a real anchor so the tests can
  // assert against the rendered href (Button renders Link → <a> when `to`
  // is set in the actual implementation).
  Button: ({
    children,
    onClick,
    to,
    'data-testid': testId,
  }: {
    children: ReactNode;
    onClick?: () => void;
    to?: string;
    'data-testid'?: string;
  }) => {
    const inner = (
      <button onClick={onClick} data-testid={testId}>
        {children}
      </button>
    );
    return to ? <a href={to}>{inner}</a> : inner;
  },
}));
vi.mock('@redocly/theme/components/Tooltip/Tooltip', () => ({
  Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock('@redocly/theme/icons/CheckmarkIcon/CheckmarkIcon', () => ({ CheckmarkIcon: () => null }));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mocks.normalizeUrl.mockImplementation((href: string) => href);
});

function renderInRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

function createItem(title: string, link = `/${title}`) {
  return { title, link, deprecated: false };
}

function createNode(overrides: Partial<GroupItemNode>): { node: GroupItemNode } {
  const defaultItems: [GroupItemsPanelItem] = [
    { kind: panelKind.GROUP_ITEMS, title: 'Operations', items: [] },
  ];
  return {
    node: {
      title: 'Operations',
      children: defaultItems,
      ...overrides,
    },
  };
}

it('should render the group title', () => {
  renderInRouter(
    <GroupPanelItem
      {...createNode({
        children: [
          { kind: panelKind.GROUP_ITEMS, title: 'Pet Endpoints', items: [createItem('getPet')] },
        ],
      })}
    />,
  );
  expect(screen.getByText('Pet Endpoints')).toBeInTheDocument();
});

it('should translate group title via titleTranslationKey when set', () => {
  renderInRouter(
    <GroupPanelItem
      {...createNode({
        children: [
          {
            kind: 'group-items',
            title: 'Operations',
            titleTranslationKey: 'operations',
            items: [createItem('listPets')],
          },
        ],
      })}
    />,
  );
  expect(screen.getByText('Operationen')).toBeDefined();
  expect(screen.queryByText('Operations')).toBeNull();
});

it('should fall back to literal title when titleTranslationKey is unknown', () => {
  renderInRouter(
    <GroupPanelItem
      {...createNode({
        children: [
          {
            kind: 'group-items',
            title: 'Custom Title',
            titleTranslationKey: 'no.such.key',
            items: [createItem('listPets')],
          },
        ],
      })}
    />,
  );
  expect(screen.getByText('Custom Title')).toBeDefined();
});

it('should render all items when there are 8 or fewer', () => {
  const items = Array.from({ length: 8 }, (_, i) => createItem(`item-${i}`));
  renderInRouter(
    <GroupPanelItem
      {...createNode({ children: [{ kind: panelKind.GROUP_ITEMS, title: 'Operations', items }] })}
    />,
  );

  items.forEach((item) => expect(screen.getByText(item.title)).toBeInTheDocument());
  expect(screen.queryByTestId('show-more-operations')).not.toBeInTheDocument();
});

it('should show only 8 items when there are more than 8', () => {
  const items = Array.from({ length: 12 }, (_, i) => createItem(`item-${i}`));
  renderInRouter(
    <GroupPanelItem
      {...createNode({ children: [{ kind: panelKind.GROUP_ITEMS, title: 'Operations', items }] })}
    />,
  );

  expect(screen.queryByText('item-8')).not.toBeInTheDocument();
  expect(screen.getByTestId('show-more-operations')).toBeInTheDocument();
});

it('should display the count of hidden items in the show more button', () => {
  const items = Array.from({ length: 11 }, (_, i) => createItem(`item-${i}`));
  renderInRouter(
    <GroupPanelItem
      {...createNode({ children: [{ kind: panelKind.GROUP_ITEMS, title: 'Operations', items }] })}
    />,
  );

  expect(screen.getByTestId('show-more-operations')).toHaveTextContent('3');
});

it('should reveal all items after clicking show more', () => {
  const items = Array.from({ length: 10 }, (_, i) => createItem(`item-${i}`));
  renderInRouter(
    <GroupPanelItem
      {...createNode({ children: [{ kind: 'group-items', title: 'Operations', items }] })}
    />,
  );

  fireEvent.click(screen.getByTestId('show-more-operations'));

  items.forEach((item) => expect(screen.getByText(item.title)).toBeInTheDocument());
  expect(screen.queryByTestId('show-more-operations')).not.toBeInTheDocument();
});

it('always shows child-tag (sub-group) sections and excludes them from the show-more limit', () => {
  const operations = Array.from({ length: 12 }, (_, i) => createItem(`op-${i}`));
  const subGroup = { ...createItem('Sub Group', '/sub'), childTag: true };

  renderInRouter(
    <GroupPanelItem
      {...createNode({
        children: [
          { kind: panelKind.GROUP_ITEMS, title: '', items: [subGroup] },
          { kind: panelKind.GROUP_ITEMS, title: 'Operations', items: operations },
        ],
      })}
    />,
  );

  expect(screen.getByText('Sub Group')).toBeInTheDocument();
  expect(screen.queryByText('op-8')).not.toBeInTheDocument();
  expect(screen.getByTestId('show-more-operations')).toHaveTextContent('4');
});

it('renders each item as a link to the normalized href', () => {
  const items = [createItem('pets', '/pets')];
  renderInRouter(
    <GroupPanelItem
      {...createNode({ children: [{ kind: panelKind.GROUP_ITEMS, title: 'Operations', items }] })}
    />,
  );

  expect(mocks.normalizeUrl).toHaveBeenCalledWith('/pets');
  expect(screen.getByText('pets').closest('a')).toHaveAttribute('href', '/pets');
});

it('passes the relative item link through useNavigationUrlNormalizer when a router basename is present', () => {
  // Simulate a router basename of '/docs/openapi' by having the normalizer prepend it.
  mocks.normalizeUrl.mockImplementation((href: string) => `/docs/openapi${href}`);

  const items = [createItem('pets', '/pets')];
  renderInRouter(
    <GroupPanelItem
      {...createNode({ children: [{ kind: panelKind.GROUP_ITEMS, title: 'Operations', items }] })}
    />,
  );

  expect(mocks.normalizeUrl).toHaveBeenCalledWith('/pets');
  expect(screen.getByText('pets').closest('a')).toHaveAttribute('href', '/docs/openapi/pets');
});

it('also passes child-tag links through useNavigationUrlNormalizer', () => {
  mocks.normalizeUrl.mockImplementation((href: string) => `/docs/openapi${href}`);

  const childTagItem = { ...createItem('users', '/users'), childTag: true };
  renderInRouter(
    <GroupPanelItem
      {...createNode({
        children: [{ kind: panelKind.GROUP_ITEMS, title: 'Operations', items: [childTagItem] }],
      })}
    />,
  );

  expect(mocks.normalizeUrl).toHaveBeenCalledWith('/users');
  expect(screen.getByText('users').closest('a')).toHaveAttribute('href', '/docs/openapi/users');
});

it('strips the path prefix from operation hrefs so the portal Link does not apply it twice', () => {
  vi.stubEnv('REDOCLY_PREFIX_PATHS', 'docs');
  mocks.normalizeUrl.mockImplementation((href: string) => `/docs/openapi${href}`);
  try {
    const items = [createItem('pets', '/pets')];
    renderInRouter(
      <GroupPanelItem
        {...createNode({ children: [{ kind: panelKind.GROUP_ITEMS, title: 'Operations', items }] })}
      />,
    );

    expect(screen.getByText('pets').closest('a')).toHaveAttribute('href', '/openapi/pets');
  } finally {
    vi.unstubAllEnvs();
  }
});

it('strips the path prefix from child-tag hrefs so the portal Link does not apply it twice', () => {
  vi.stubEnv('REDOCLY_PREFIX_PATHS', 'docs');
  mocks.normalizeUrl.mockImplementation((href: string) => `/docs/openapi${href}`);
  try {
    const childTagItem = { ...createItem('users', '/users'), childTag: true };
    renderInRouter(
      <GroupPanelItem
        {...createNode({
          children: [{ kind: panelKind.GROUP_ITEMS, title: 'Operations', items: [childTagItem] }],
        })}
      />,
    );

    expect(screen.getByText('users').closest('a')).toHaveAttribute('href', '/openapi/users');
  } finally {
    vi.unstubAllEnvs();
  }
});
