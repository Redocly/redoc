import { memo, useEffect, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useLocation } from 'react-router';

import type { ReactElement } from 'react';
import type { RouteItem, RouteIndex, TopLevelEntry } from '../utils/routing.js';

import { ThreePanelLayout } from '@redocly/theme/layouts/ThreePanelLayout';

import { layoutAtom, collapsedSidebarAtom } from '../jotai/app.js';
import { contentType } from '../types/common.js';
import { markSectionRendered } from '../components/common/LazySection.js';
import { NotFoundPage } from './NotFoundPage.js';
import { TopLevelEntryView } from './TopLevelEntryView.js';
import { buildTopLevelEntries, buildEagerSlugs, resolveRouteByPathname } from '../utils/routing.js';
import { useApiDocsScroll } from '../hooks/useApiDocsScroll.js';
import { useHashLinkRedirect } from '../hooks/useHashLinkRedirect.js';
import { useIsHydrated } from '../hooks/useIsHydrated.js';

type EntryPageProps = {
  routeIndex: RouteIndex;
  basePath: string;
};

/**
 * Renders the whole API as one persistent tree with two layers of laziness:
 *
 *   1. **Top-level LazySections** — one per top-level entry (root page,
 *      every top-level tag, any standalone non-tag route). Each
 *      observer-mounts when scrolled near the viewport and stays mounted.
 *
 *   2. **Ops inside a tag** — when the tag is in scope (active route OR an
 *      ancestor of the active route), every op renders as a nested
 *      LazySection. The active op is eager; the rest are placeholders that
 *      observer-mount on scroll. When the tag goes out of scope, its ops
 *      unmount; the active op of the new tag becomes eager.
 *
 * Section pointer routes (`route.content === null`) live inside the root
 * page's overview body — when one is active, the root page is eager.
 */
function EntryPageComponent({ routeIndex, basePath }: EntryPageProps): ReactElement {
  const layout = useAtomValue(layoutAtom);
  const collapsedSidebar = useAtomValue(collapsedSidebarAtom);
  const location = useLocation();
  const isHydrated = useIsHydrated();

  const activeRoute = useMemo<RouteItem | undefined>(
    () => resolveRouteByPathname(routeIndex, location.pathname),
    [routeIndex, location.pathname],
  );

  const topLevelEntries = useMemo<TopLevelEntry[]>(
    () => buildTopLevelEntries(routeIndex),
    [routeIndex],
  );

  const eagerSlugs = useMemo<Set<string>>(
    () => buildEagerSlugs(activeRoute, routeIndex),
    [activeRoute, routeIndex],
  );

  useEffect(() => {
    eagerSlugs.forEach((slug) => markSectionRendered(slug));
  }, [eagerSlugs]);

  useApiDocsScroll({ activeRoute, routeIndex, basePath, isHydrated });
  const redirectHashLink = useHashLinkRedirect(basePath, routeIndex);

  const activePath = activeRoute?.path;

  // Before hydration, render only the active entry and the entries after it,
  // so a deep-linked visitor sees their content at the top of the SSR HTML
  // without waiting for JS to scroll. After hydration the full tree renders
  // and `useApiDocsScroll` re-scrolls in the same commit, hiding the shift.
  const visibleEntries = useMemo<TopLevelEntry[]>(() => {
    if (isHydrated || !activePath) return topLevelEntries;

    const activeIdx = topLevelEntries.findIndex(
      (entry) =>
        entry.sectionId === activePath || entry.children.some((c) => c.path === activePath),
    );
    return activeIdx > 0 ? topLevelEntries.slice(activeIdx) : topLevelEntries;
  }, [topLevelEntries, activePath, isHydrated]);

  if (!activeRoute && routeIndex.allRoutes.length > 0) {
    return <NotFoundPage routingBasePath={basePath} />;
  }

  return (
    <ThreePanelLayout
      className="api-content"
      id="api-content"
      layout={layout}
      collapsedSidebar={collapsedSidebar}
      onClickCapture={redirectHashLink}
    >
      {visibleEntries.map((entry) => {
        const activeOpIndex = entry.children.findIndex((c) => c.path === activePath);
        const opsStartIndex = !isHydrated && activeOpIndex > 0 ? activeOpIndex : 0;
        const renderEntrySection = isHydrated || activeOpIndex === -1;
        return (
          <TopLevelEntryView
            key={entry.sectionId}
            entry={entry}
            activePath={activePath}
            entryEager={eagerSlugs.has(entry.sectionId)}
            eagerOpSlug={entry.children.find((c) => eagerSlugs.has(c.path))?.path ?? null}
            opsStartIndex={opsStartIndex}
            renderEntrySection={renderEntrySection}
            shouldRenderOps={
              entry.sectionId === activePath ||
              entry.children.some((c) => c.path === activePath) ||
              (entry.children.length > 0 && entry.content.contentType !== contentType.GROUP)
            }
          />
        );
      })}
    </ThreePanelLayout>
  );
}

export const EntryPage = memo(EntryPageComponent);

