import { memo } from 'react';

import type { ReactElement } from 'react';
import type { TopLevelEntry } from '../utils/routing.js';

import { ComponentMapper } from '../components/Mapper.js';
import { contentType } from '../types/common.js';
import { LazySection } from '../components/common/LazySection.js';

type TopLevelEntryViewProps = {
  entry: TopLevelEntry;
  activePath: string | undefined;
  entryEager: boolean;
  eagerOpSlug: string | null;
  shouldRenderOps: boolean;
  opsStartIndex?: number;
  renderEntrySection?: boolean;
};

function isGateOpen(gatePath: string, activePath: string | undefined): boolean {
  if (!activePath) return false;
  return activePath === gatePath || activePath.startsWith(gatePath + '/');
}

/** Renders one top-level entry as a LazySection plus, when in scope, its op
 *  LazySections. The op LazySections are siblings (not children) of the
 *  entry's LazySection so the entry's memo bail doesn't keep a stale `eager`
 *  prop on the active op during sibling-op navigation. */
export const TopLevelEntryView = memo(function TopLevelEntryView({
  entry,
  activePath,
  entryEager,
  eagerOpSlug,
  shouldRenderOps,
  opsStartIndex = 0,
  renderEntrySection = true,
}: TopLevelEntryViewProps): ReactElement {
  // Only GROUP hubs gate descendants behind their open state; a channel (ITEM)
  // keeps all its operations mounted as scroll placeholders.
  const gateByParent = entry.content.contentType === contentType.GROUP;
  return (
    <>
      {renderEntrySection && (
        <LazySection sectionId={entry.sectionId} eager={entryEager}>
          <ComponentMapper
            sectionId={entry.sectionId}
            type={entry.content.contentType ?? contentType.OVERVIEW}
            content={entry.content}
            itemPath={entry.path}
          />
        </LazySection>
      )}
      {shouldRenderOps &&
        entry.children.slice(opsStartIndex).map((child) => {
          if (child.content === null) return null;
          if (gateByParent && !isGateOpen(child.gatePath, activePath)) return null;
          return (
            <LazySection key={child.path} sectionId={child.path} eager={child.path === eagerOpSlug}>
              <ComponentMapper
                sectionId={child.path}
                type={child.content.contentType}
                content={child.content}
                itemPath={child.path}
              />
            </LazySection>
          );
        })}
    </>
  );
});
