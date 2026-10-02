import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ReactElement, ReactNode } from 'react';
import type * as ReactRouterDom from 'react-router';
import type { ApiItemContent, ApiStore } from '../../types/store.js';
import type { ApiDocsOptions } from '../../types/options.js';

import { SECTION_ATTR } from '../../constants/openapi.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { GroupPage } from '../GroupPage.js';

const { componentMapperSpy, useIsExpandedSpy, navigateSpy } = vi.hoisted(() => ({
  componentMapperSpy: vi.fn(),
  useIsExpandedSpy: vi.fn((_id: string) => true),
  navigateSpy: vi.fn(),
}));

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouterDom>();
  return { ...actual, useNavigate: () => navigateSpy };
});

vi.mock('../../components/Mapper.js', () => ({
  ComponentMapper: (props: { itemPath?: string; type?: string }) => {
    componentMapperSpy(props);
    return <div data-testid="group-component-mapper" />;
  },
}));

vi.mock('../../hooks/useTranslate.js', () => ({
  useTranslate: () => (_key: string, fallback: string) => fallback,
  useSpecTranslate: () => (_key: string, fallback: string) => fallback,
}));

vi.mock('../../hooks/useIsExpanded.js', () => ({
  useIsExpanded: (id: string) => useIsExpandedSpy(id),
}));

vi.mock('../../hooks/useNormalizeUrl.js', () => ({
  useNormalizeUrl: (url: string) => `/normalized${url}`,
  useNavigationUrlNormalizer: () => (url: string) => `/normalized${url}`,
}));

vi.mock('../../hoc/withItemId.js', () => ({
  withItemId:
    <T extends object>(Component: (props: T) => ReactElement) =>
    (props: T): ReactElement => <Component {...props} />,
}));

vi.mock('@redocly/theme/components/Button/Button', () => ({
  // Forward `to` as an anchor so the test can assert against the rendered href.
  Button: ({
    children,
    onClick,
    to,
  }: {
    children: ReactNode;
    onClick?: () => void;
    to?: string;
  }) => {
    const inner = <button onClick={onClick}>{children}</button>;
    return to ? <a href={to}>{inner}</a> : inner;
  },
}));

const EMPTY_API_STORE: ApiStore = { schemaStore: {}, exampleStore: {}, securitySchemeStore: {} };

function renderGroupPage(content: ApiItemContent, isExpanded = true, sectionId?: string) {
  useIsExpandedSpy.mockReturnValue(isExpanded);

  const store = createStore();
  store.set(globalStoreAtom, {
    items: [],
    store: EMPTY_API_STORE,
    options: { basePath: '/docs' } as ApiDocsOptions,
    replayDefinition: null,
  });

  return render(
    <JotaiProvider store={store}>
      <MemoryRouter>
        <GroupPage itemPath="/api/pets/list" sectionId={sectionId} content={content} />
      </MemoryRouter>
    </JotaiProvider>,
  );
}

describe('GroupPage', () => {
  beforeEach(() => {
    componentMapperSpy.mockClear();
    useIsExpandedSpy.mockReset();
    navigateSpy.mockClear();
  });

  it('renders breadcrumbs that navigate to the normalized url, children and section attr', () => {
    const content = {
      meta: {
        breadcrumbs: [{ label: 'API' }, { label: 'Pets' }],
      },
      children: [{ nodeType: 'paragraph' }, { nodeType: 'table' }],
    } as unknown as ApiItemContent;

    const { container } = renderGroupPage(content, true, '/section/group');

    fireEvent.click(screen.getByRole('button', { name: 'API' }));
    expect(navigateSpy).toHaveBeenCalledWith('/normalized/api');

    fireEvent.click(screen.getByRole('button', { name: 'Pets' }));
    expect(navigateSpy).toHaveBeenCalledWith('/normalized/api/pets');

    expect(screen.getAllByTestId('group-component-mapper')).toHaveLength(2);
    expect(componentMapperSpy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        itemPath: '/api/pets/list',
        type: 'paragraph',
      }),
    );
    expect(container.querySelector(`[${SECTION_ATTR}]`)).toHaveAttribute(
      SECTION_ATTR,
      '/section/group',
    );
  });

  it('navigates to the normalized page url on click for groups with navigation', () => {
    const content = {
      children: [
        { nodeType: 'paragraph' },
        { nodeType: 'container', panels: [{ children: [{ kind: 'group-items', items: [] }] }] },
      ],
    } as unknown as ApiItemContent;

    renderGroupPage(content, false);

    fireEvent.click(screen.getByText('+ Show'));

    expect(navigateSpy).toHaveBeenCalledWith('/normalized/api/pets/list', {
      state: { expandInPlace: true },
    });
  });

  it('does not show the collapsed CTA for a leaf group with no navigation panel', () => {
    const content = {
      children: [{ nodeType: 'paragraph' }],
    } as unknown as ApiItemContent;

    renderGroupPage(content, false);

    expect(screen.queryByText('+ Show')).not.toBeInTheDocument();
  });

  it('does not render breadcrumbs when metadata does not include breadcrumbs', () => {
    const content = {
      children: [{ nodeType: 'paragraph' }],
    } as unknown as ApiItemContent;

    renderGroupPage(content, true, '/section/group');

    expect(screen.queryByRole('button', { name: 'API' })).not.toBeInTheDocument();
    expect(screen.getAllByTestId('group-component-mapper')).toHaveLength(1);
  });

  it('does not apply section attr when sectionId is not provided', () => {
    const content = {
      children: [{ nodeType: 'paragraph' }],
    } as unknown as ApiItemContent;

    const { container } = renderGroupPage(content);

    expect(container.querySelector(`[${SECTION_ATTR}]`)).toBeNull();
  });
});
