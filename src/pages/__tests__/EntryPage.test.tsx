import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { createStore, Provider as JotaiProvider } from 'jotai';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/vitest';

import type { ReactNode } from 'react';
import type { ApiItemContent } from '../../types/store.js';
import type { ApiDocsOptions } from '../../types/options.js';
import type { RouteItem, RouteIndex, TagWithItems } from '../../utils/routing.js';

import { contentType } from '../../types/common.js';
import { globalStoreAtom } from '../../jotai/store.js';
import { EntryPage } from '../EntryPage.js';

const { lazySectionSpy, useApiDocsScrollSpy, useIsHydratedMock } = vi.hoisted(() => ({
  lazySectionSpy: vi.fn(),
  useApiDocsScrollSpy: vi.fn(),
  useIsHydratedMock: vi.fn((): boolean => true),
}));

vi.mock('../../hooks/useIsHydrated.js', () => ({
  useIsHydrated: () => useIsHydratedMock(),
}));

vi.mock('../../components/common/LazySection.js', () => ({
  LazySection: ({
    sectionId,
    eager,
    children,
  }: {
    sectionId: string;
    eager?: boolean;
    children: ReactNode;
  }) => {
    lazySectionSpy({ sectionId, eager: eager ?? false });
    return (
      <div
        data-testid="lazy-section"
        data-section-id={sectionId}
        data-eager={String(eager ?? false)}
      >
        {children}
      </div>
    );
  },
  markSectionRendered: vi.fn(),
}));

vi.mock('../../components/Mapper.js', () => ({
  ComponentMapper: (props: { sectionId?: string }) => (
    <div data-testid="component-mapper" data-mapper-section={props.sectionId} />
  ),
}));

vi.mock('../../hooks/useApiDocsScroll.js', () => ({
  useApiDocsScroll: (args: unknown) => {
    useApiDocsScrollSpy(args);
  },
}));

vi.mock('@redocly/theme/layouts/ThreePanelLayout', () => ({
  ThreePanelLayout: ({ children }: { children: ReactNode }) => (
    <div data-testid="three-panel-layout">{children}</div>
  ),
}));

vi.mock('../NotFoundPage.js', () => ({
  NotFoundPage: () => <div data-testid="not-found-page" />,
}));

function makeRoute(path: string, overrides: Partial<RouteItem> = {}): RouteItem {
  return {
    path,
    label: path,
    content: {
      contentType: contentType.GROUP,
      children: [],
    } as ApiItemContent,
    ...overrides,
  };
}

function makeFlatRouteIndex(routes: RouteItem[]): RouteIndex {
  return {
    allRoutes: routes,
    tagByPath: new Map(),
    itemToParentTag: new Map(),
    routeIndexByPath: new Map(routes.map((r, i) => [r.path, i])),
    rootPage: routes[0],
    tags: [],
  };
}

function makeTagRouteIndex(
  rootPage: RouteItem,
  tagRoute: RouteItem,
  opRoutes: RouteItem[],
): RouteIndex {
  const tagData: TagWithItems = { tag: tagRoute, items: opRoutes };
  const allRoutes = [rootPage, tagRoute, ...opRoutes];
  return {
    allRoutes,
    tagByPath: new Map([[tagRoute.path, tagData]]),
    itemToParentTag: new Map(opRoutes.map((op) => [op.path, tagData])),
    routeIndexByPath: new Map(allRoutes.map((r, i) => [r.path, i])),
    rootPage,
    tags: [tagRoute],
  };
}

function renderEntry(
  routeIndex: RouteIndex,
  initialPath: string,
  basePath = '/',
  options?: Partial<ApiDocsOptions>,
) {
  const store = createStore();
  if (options) {
    store.set(globalStoreAtom, {
      ...store.get(globalStoreAtom),
      options: options as ApiDocsOptions,
    });
  }
  return render(
    <JotaiProvider store={store}>
      <MemoryRouter initialEntries={[initialPath]}>
        <EntryPage routeIndex={routeIndex} basePath={basePath} />
      </MemoryRouter>
    </JotaiProvider>,
  );
}

function lazySectionsBySlug(): Record<string, HTMLElement> {
  return Object.fromEntries(
    screen
      .getAllByTestId('lazy-section')
      .map((el) => [el.getAttribute('data-section-id') ?? '', el] as const),
  );
}

function mapperSlugsIn(el: HTMLElement | undefined): string[] {
  if (!el) return [];
  return within(el)
    .getAllByTestId('component-mapper')
    .map((m) => m.getAttribute('data-mapper-section') ?? '');
}

describe('EntryPage', () => {
  beforeEach(() => {
    lazySectionSpy.mockClear();
    useApiDocsScrollSpy.mockClear();
    useIsHydratedMock.mockReturnValue(true);
  });

  describe('pre-hydration render of a deep-linked op starts at the op itself', () => {
    function makePetsRouteIndex() {
      const root = makeRoute('/');
      const tag = makeRoute('/pets');
      const op1 = makeRoute('/pets/get-pets');
      const op2 = makeRoute('/pets/create-pet');
      const op3 = makeRoute('/pets/delete-pet');
      return makeTagRouteIndex(root, tag, [op1, op2, op3]);
    }

    it('skips the owning entry section, prior entries, and prior ops', () => {
      useIsHydratedMock.mockReturnValue(false);

      renderEntry(makePetsRouteIndex(), '/pets/create-pet');

      const slugs = lazySectionsBySlug();
      expect(slugs['/']).toBeUndefined();
      expect(slugs['/pets']).toBeUndefined();
      expect(slugs['/pets/get-pets']).toBeUndefined();
      expect(slugs['/pets/create-pet']?.getAttribute('data-eager')).toBe('true');
      expect(slugs['/pets/delete-pet']?.getAttribute('data-eager')).toBe('false');
    });

    it('keeps the entry section when the active route is the tag itself', () => {
      useIsHydratedMock.mockReturnValue(false);

      renderEntry(makePetsRouteIndex(), '/pets');

      const slugs = lazySectionsBySlug();
      expect(slugs['/pets']?.getAttribute('data-eager')).toBe('true');
      expect(slugs['/pets/get-pets']?.getAttribute('data-eager')).toBe('true');
    });

    it('renders the entry section and all prior content after hydration', () => {
      useIsHydratedMock.mockReturnValue(true);

      renderEntry(makePetsRouteIndex(), '/pets/create-pet');

      const slugs = lazySectionsBySlug();
      expect(slugs['/']).toBeDefined();
      expect(slugs['/pets']).toBeDefined();
      expect(slugs['/pets/get-pets']).toBeDefined();
      expect(slugs['/pets/create-pet']?.getAttribute('data-eager')).toBe('true');
    });
  });

  describe('in-scope tag renders ALL its ops; out-of-scope tags render none', () => {
    it('clicking the LAST op renders every op in the tag (so the ones above it are still reachable on scroll up)', () => {
      // Regression for "jump to the last item and all the previous ones are
      // gone" — within an in-scope tag, every op must exist as a
      // LazySection regardless of where the active op sits in source order.
      const root = makeRoute('/');
      const tag = makeRoute('/pets');
      const op1 = makeRoute('/pets/get-pets');
      const op2 = makeRoute('/pets/create-pet');
      const op3 = makeRoute('/pets/delete-pet');
      const op4 = makeRoute('/pets/update-pet');
      const op5 = makeRoute('/pets/list-pet'); // active (last)

      const routeIndex = makeTagRouteIndex(root, tag, [op1, op2, op3, op4, op5]);
      renderEntry(routeIndex, '/pets/list-pet');

      const slugs = lazySectionsBySlug();
      // Every op in `/pets` is a LazySection — the ops BEFORE the active
      // op are placeholders that observer-mount as the user scrolls up.
      expect(Object.keys(slugs).sort()).toEqual([
        '/',
        '/pets',
        '/pets/create-pet',
        '/pets/delete-pet',
        '/pets/get-pets',
        '/pets/list-pet',
        '/pets/update-pet',
      ]);
    });

    it('clicking a mid-tag op makes only that op eager; the others are placeholders that observer-mount', () => {
      const root = makeRoute('/');
      const tag = makeRoute('/pets');
      const op1 = makeRoute('/pets/get-pets');
      const op2 = makeRoute('/pets/create-pet'); // active
      const op3 = makeRoute('/pets/delete-pet');

      const routeIndex = makeTagRouteIndex(root, tag, [op1, op2, op3]);
      renderEntry(routeIndex, '/pets/create-pet');

      const slugs = lazySectionsBySlug();
      // The active op is eager — its content lands in the DOM immediately
      // so the scrollIntoView lands on real content, not a placeholder.
      expect(slugs['/pets/create-pet']?.getAttribute('data-eager')).toBe('true');
      // The op above the active one is a placeholder (not eager) — it
      // exists in the DOM (so scrolling up reaches it) but waits for the
      // intersection observer.
      expect(slugs['/pets/get-pets']?.getAttribute('data-eager')).toBe('false');
      // The op below the active one is also a placeholder.
      expect(slugs['/pets/delete-pet']?.getAttribute('data-eager')).toBe('false');
    });

    it('clicking the tag itself renders ALL ops, with the first one eager and the rest observer-mounted', () => {
      const root = makeRoute('/');
      const tag = makeRoute('/pets');
      const op1 = makeRoute('/pets/get-pets');
      const op2 = makeRoute('/pets/create-pet');
      const op3 = makeRoute('/pets/delete-pet');

      const routeIndex = makeTagRouteIndex(root, tag, [op1, op2, op3]);
      renderEntry(routeIndex, '/pets');

      const slugs = lazySectionsBySlug();
      expect(Object.keys(slugs).sort()).toEqual([
        '/',
        '/pets',
        '/pets/create-pet',
        '/pets/delete-pet',
        '/pets/get-pets',
      ]);
      expect(slugs['/pets/get-pets']?.getAttribute('data-eager')).toBe('true');
      expect(slugs['/pets/create-pet']?.getAttribute('data-eager')).toBe('false');
      expect(slugs['/pets/delete-pet']?.getAttribute('data-eager')).toBe('false');
    });

    it('an OUT-OF-SCOPE tag is fully collapsed — only its header, ZERO op LazySections', () => {
      // Active route is `/` — the `/pets` tag is out of scope. Its top-level
      // LazySection still exists (so the tag header can render on scroll)
      // but no op LazySections render inside, so scrolling past `/pets`
      // doesn't show placeholder stacks for ops the user hasn't opened.
      const root = makeRoute('/');
      const tag = makeRoute('/pets');
      const op1 = makeRoute('/pets/get-pets');
      const op2 = makeRoute('/pets/create-pet');

      const routeIndex = makeTagRouteIndex(root, tag, [op1, op2]);
      renderEntry(routeIndex, '/');

      const slugs = lazySectionsBySlug();
      expect(Object.keys(slugs).sort()).toEqual(['/', '/pets']);
      expect(mapperSlugsIn(slugs['/pets'])).toEqual(['/pets']);
    });

    it('keeps an OUT-OF-SCOPE channel’s operations mounted as placeholders (asyncapi scroll stack)', () => {
      // A channel (content type ITEM/CHANNEL, not a GROUP tag hub) keeps its
      // operations in the DOM even when out of scope, so scrolling into a
      // sibling/untagged channel reveals its operations. Regression for
      // e31c773 ("fixed rendering channel operations at asyncapi").
      const root = makeRoute('/');
      const channel = makeRoute('/topics/ratings', {
        content: { contentType: contentType.ITEM, children: [] } as ApiItemContent,
      });
      const op1 = makeRoute('/topics/ratings/operations/publishrating');
      const op2 = makeRoute('/topics/ratings/operations/receiverating');

      const routeIndex = makeTagRouteIndex(root, channel, [op1, op2]);
      renderEntry(routeIndex, '/'); // active route is `/` — the channel is out of scope

      const slugs = lazySectionsBySlug();
      // The channel's operations are mounted (as non-eager placeholders that
      // observer-mount on scroll), unlike a GROUP tag hub which stays collapsed.
      expect(slugs['/topics/ratings/operations/publishrating']?.getAttribute('data-eager')).toBe(
        'false',
      );
      expect(slugs['/topics/ratings/operations/receiverating']?.getAttribute('data-eager')).toBe(
        'false',
      );
    });

    it('skips ops with null content when picking the first child', () => {
      const root = makeRoute('/');
      const tag = makeRoute('/pets');
      const sectionPointer = makeRoute('/pets/skip', {
        content: null as unknown as ApiItemContent,
      });
      const op1 = makeRoute('/pets/get-pets');

      const routeIndex = makeTagRouteIndex(root, tag, [sectionPointer, op1]);
      renderEntry(routeIndex, '/pets');

      const slugs = lazySectionsBySlug();
      expect(slugs['/pets/skip']).toBeUndefined();
      expect(slugs['/pets/get-pets']?.getAttribute('data-eager')).toBe('true');
    });
  });

  describe('eager flag on top-level LazySections', () => {
    it('the active op IS eager; the owning tag and other top-levels are NOT', () => {
      // Only the active route is eagerly mounted. The owning tag's
      // top-level LazySection is a placeholder until the user scrolls up
      // to it (then `IntersectionObserver` mounts it). See `buildEagerSlugs`
      // for the rationale.
      const root = makeRoute('/');
      const tag = makeRoute('/pets');
      const op1 = makeRoute('/pets/get-pets');

      const routeIndex = makeTagRouteIndex(root, tag, [op1]);
      renderEntry(routeIndex, '/pets/get-pets');

      const slugs = lazySectionsBySlug();
      expect(slugs['/pets/get-pets']?.getAttribute('data-eager')).toBe('true');
      expect(slugs['/pets']?.getAttribute('data-eager')).toBe('false');
      expect(slugs['/']?.getAttribute('data-eager')).toBe('false');
    });

    it("the active TAG itself is eager + its first op is eager (so the tag isn't a header floating above placeholders)", () => {
      const root = makeRoute('/');
      const tag = makeRoute('/pets');
      const op1 = makeRoute('/pets/get-pets');
      const op2 = makeRoute('/pets/create-pet');

      const routeIndex = makeTagRouteIndex(root, tag, [op1, op2]);
      renderEntry(routeIndex, '/pets');

      const slugs = lazySectionsBySlug();
      expect(slugs['/pets']?.getAttribute('data-eager')).toBe('true');
      expect(slugs['/pets/get-pets']?.getAttribute('data-eager')).toBe('true');
      expect(slugs['/pets/create-pet']?.getAttribute('data-eager')).toBe('false');
    });

    it('section pointer routes (null content) make the root page eager', () => {
      const root = makeRoute('/', {
        content: { contentType: contentType.OVERVIEW, children: [] } as ApiItemContent,
      });
      const sectionPointer = makeRoute('/section/intro', {
        content: null as unknown as ApiItemContent,
      });
      const allRoutes = [root, sectionPointer];
      const routeIndex: RouteIndex = {
        allRoutes,
        tagByPath: new Map(),
        itemToParentTag: new Map(),
        routeIndexByPath: new Map([
          ['/', 0],
          ['/section/intro', 1],
        ]),
        rootPage: root,
        tags: [],
      };

      renderEntry(routeIndex, '/section/intro');

      const slugs = lazySectionsBySlug();
      expect(slugs['/']?.getAttribute('data-eager')).toBe('true');
      // Section pointers don't get their own LazySection.
      expect(slugs['/section/intro']).toBeUndefined();
    });
  });

  describe('nested groups: a collapsed sub-group hides its descendants', () => {
    // topGroup ▸ subGroup ▸ op.
    function makeNestedRouteIndex(): {
      routeIndex: RouteIndex;
      paths: { root: string; topGroup: string; subGroup: string; op: string };
    } {
      const root = makeRoute('/');
      const topGroup = makeRoute('/g');
      const subGroup = makeRoute('/g/sub');
      const op = makeRoute('/g/sub/op', {
        content: { contentType: contentType.ITEM, children: [] } as ApiItemContent,
      });
      const topData: TagWithItems = { tag: topGroup, items: [subGroup] };
      const subData: TagWithItems = { tag: subGroup, items: [op] };
      const allRoutes = [root, topGroup, subGroup, op];
      return {
        routeIndex: {
          allRoutes,
          tagByPath: new Map([
            [topGroup.path, topData],
            [subGroup.path, subData],
          ]),
          itemToParentTag: new Map([
            [subGroup.path, topData],
            [op.path, subData],
          ]),
          routeIndexByPath: new Map(allRoutes.map((r, i) => [r.path, i])),
          rootPage: root,
          tags: [topGroup],
        },
        paths: { root: '/', topGroup: '/g', subGroup: '/g/sub', op: '/g/sub/op' },
      };
    }

    it('on the parent group, the sub-group is a preview and its operation does NOT render', () => {
      const { routeIndex } = makeNestedRouteIndex();
      renderEntry(routeIndex, '/g');

      const slugs = lazySectionsBySlug();
      expect(slugs['/g/sub']).toBeDefined();
      expect(slugs['/g/sub/op']).toBeUndefined();
    });

    it('on the sub-group itself, its operation renders', () => {
      const { routeIndex } = makeNestedRouteIndex();
      renderEntry(routeIndex, '/g/sub');

      const slugs = lazySectionsBySlug();
      expect(slugs['/g/sub']).toBeDefined();
      expect(slugs['/g/sub/op']).toBeDefined();
    });
  });

  describe('channels nested inside a group keep their operations mounted (asyncapi)', () => {
    function makeGroupedChannelsRouteIndex(): RouteIndex {
      const root = makeRoute('/');
      const group = makeRoute('/rides');
      const channelContent = { contentType: contentType.ITEM, children: [] } as ApiItemContent;
      const requestsChannel = makeRoute('/rides/topics/ride-requests', {
        content: channelContent,
      });
      const requestsOp1 = makeRoute('/rides/topics/ride-requests/operations/produce', {
        content: channelContent,
      });
      const requestsOp2 = makeRoute('/rides/topics/ride-requests/operations/consume', {
        content: channelContent,
      });
      const matchesChannel = makeRoute('/rides/topics/ride-matches', { content: channelContent });
      const matchesOp = makeRoute('/rides/topics/ride-matches/operations/consume', {
        content: channelContent,
      });

      const groupData: TagWithItems = { tag: group, items: [requestsChannel, matchesChannel] };
      const requestsData: TagWithItems = {
        tag: requestsChannel,
        items: [requestsOp1, requestsOp2],
      };
      const matchesData: TagWithItems = { tag: matchesChannel, items: [matchesOp] };
      const allRoutes = [
        root,
        group,
        requestsChannel,
        requestsOp1,
        requestsOp2,
        matchesChannel,
        matchesOp,
      ];
      return {
        allRoutes,
        tagByPath: new Map([
          [group.path, groupData],
          [requestsChannel.path, requestsData],
          [matchesChannel.path, matchesData],
        ]),
        itemToParentTag: new Map([
          [requestsChannel.path, groupData],
          [matchesChannel.path, groupData],
          [requestsOp1.path, requestsData],
          [requestsOp2.path, requestsData],
          [matchesOp.path, matchesData],
        ]),
        routeIndexByPath: new Map(allRoutes.map((r, i) => [r.path, i])),
        rootPage: root,
        tags: [group],
      };
    }

    it('a SIBLING channel’s operations stay mounted as placeholders when another channel in the group is active (scroll-up reveals them, not just the channel header)', () => {
      renderEntry(makeGroupedChannelsRouteIndex(), '/rides/topics/ride-matches');

      const slugs = lazySectionsBySlug();
      // The sibling channel itself renders (its parent group is open) …
      expect(slugs['/rides/topics/ride-requests']).toBeDefined();
      // … and so do its operations — as non-eager placeholders.
      expect(
        slugs['/rides/topics/ride-requests/operations/produce']?.getAttribute('data-eager'),
      ).toBe('false');
      expect(
        slugs['/rides/topics/ride-requests/operations/consume']?.getAttribute('data-eager'),
      ).toBe('false');
    });

    it('the active channel’s own operations still render', () => {
      renderEntry(makeGroupedChannelsRouteIndex(), '/rides/topics/ride-matches');

      const slugs = lazySectionsBySlug();
      expect(slugs['/rides/topics/ride-matches']?.getAttribute('data-eager')).toBe('true');
      expect(slugs['/rides/topics/ride-matches/operations/consume']).toBeDefined();
    });

    it('when the whole group is out of scope, it stays fully collapsed — no channels, no ops', () => {
      renderEntry(makeGroupedChannelsRouteIndex(), '/');

      const slugs = lazySectionsBySlug();
      expect(Object.keys(slugs).sort()).toEqual(['/', '/rides']);
    });
  });

  it('renders the 404 page when the URL does not match any route', () => {
    const routeIndex = makeFlatRouteIndex([makeRoute('/pets')]);
    renderEntry(routeIndex, '/does-not-exist');

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
    expect(screen.queryByTestId('three-panel-layout')).not.toBeInTheDocument();
  });

  it('matches the route case-insensitively (index keys are lowercase, the typed URL may not be)', () => {
    const routes = [makeRoute('/'), makeRoute('/pets/list-pet')];
    const routeIndex = makeFlatRouteIndex(routes);

    renderEntry(routeIndex, '/Pets/List-Pet');

    expect(useApiDocsScrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({ activeRoute: routes[1] }),
    );
  });

  it('passes the active route to useApiDocsScroll', () => {
    const routes = [makeRoute('/'), makeRoute('/pets')];
    const routeIndex = makeFlatRouteIndex(routes);

    renderEntry(routeIndex, '/pets');

    expect(useApiDocsScrollSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        activeRoute: routes[1],
      }),
    );
  });
});
