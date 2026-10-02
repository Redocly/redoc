import { memo, useMemo } from 'react';
import { styled } from 'styled-components';
import { useNavigate } from 'react-router';
import { useAtomValue } from 'jotai';
import { LayoutVariant } from '@redocly/config';

import type { ReactElement } from 'react';
import type { ApiItemContent, BreadcrumbItem } from '../types/store.js';

import { Button } from '@redocly/theme/components/Button/Button';
import { breakpoints } from '@redocly/theme/core/openapi';

import { layoutAtom } from '../jotai/app.js';
import { routingBasePathAtom } from '../jotai/store.js';
import { toElementId } from '../utils/url.js';
import { SECTION_ATTR } from '../constants/openapi.js';
import { panelKind } from '../types/common.js';
import { Breadcrumbs } from '../components/common/Breadcrumbs.js';
import { ComponentMapper } from '../components/Mapper.js';
import { useSpecTranslate } from '../hooks/useTranslate.js';
import { useIsExpanded } from '../hooks/useIsExpanded.js';
import { useNormalizeUrl, useNavigationUrlNormalizer } from '../hooks/useNormalizeUrl.js';
import { compose } from '../utils/compose.js';
import { withItemId } from '../hoc/withItemId.js';

type ResolvedBreadcrumb = BreadcrumbItem & { link: string };

function buildBreadcrumbLinks(
  breadcrumbs: BreadcrumbItem[],
  currentPath: string,
): ResolvedBreadcrumb[] {
  const segments = currentPath.split('/').filter(Boolean);
  const depth = breadcrumbs.length;
  const baseSegments = segments.slice(0, segments.length - depth);

  return breadcrumbs.map((crumb, index) => ({
    label: crumb.label,
    link:
      '/' +
      [...baseSegments, ...segments.slice(baseSegments.length, baseSegments.length + index)].join(
        '/',
      ),
  }));
}

function hasGroupNavigation(content: ApiItemContent | undefined): boolean {
  for (const node of content?.children ?? []) {
    const panels = (node as { panels?: Array<{ children?: Array<{ kind?: string }> }> })?.panels;
    if (!Array.isArray(panels)) continue;
    if (
      panels.some((panel) =>
        panel?.children?.some((child) => child?.kind === panelKind.GROUP_ITEMS),
      )
    ) {
      return true;
    }
  }
  return false;
}

function GroupPageComponent({
  content,
  itemPath,
  sectionId,
}: {
  content: ApiItemContent;
  itemPath: string;
  sectionId?: string;
}): ReactElement {
  const { meta, children } = content || {};
  const translate = useSpecTranslate();
  const navigate = useNavigate();
  const isExpanded = useIsExpanded(itemPath);
  const url = useNormalizeUrl(itemPath);
  const normalizeUrl = useNavigationUrlNormalizer();
  const isStacked = useAtomValue(layoutAtom) === LayoutVariant.STACKED;
  const isExpandable = useMemo(() => hasGroupNavigation(content), [content]);

  const breadcrumbs = useMemo(
    () =>
      meta?.breadcrumbs
        ? buildBreadcrumbLinks(meta.breadcrumbs, itemPath).map((crumb) => ({
            name: crumb.label,
            href: normalizeUrl(crumb.link),
          }))
        : undefined,
    [meta?.breadcrumbs, itemPath, normalizeUrl],
  );

  const showMoreLabel = translate('actions.show', 'Show');
  const routingBasePath = useAtomValue(routingBasePathAtom);
  const sectionAttrProps = sectionId ? { [SECTION_ATTR]: sectionId } : {};
  const elementId = itemPath ? toElementId(itemPath, routingBasePath) : undefined;

  return (
    <GroupPageWrapper
      id={elementId}
      {...sectionAttrProps}
      $isExpanded={isExpanded}
      $isExpandable={isExpandable}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <BreadcrumbsContainer $isStacked={isStacked}>
          <Breadcrumbs breadcrumbs={breadcrumbs} onClick={navigate} />
        </BreadcrumbsContainer>
      )}
      {children.map((child, index) => (
        <ComponentMapper
          type={child.nodeType}
          node={child}
          key={`${itemPath}-${child.nodeType}-${index}`}
          itemPath={itemPath}
        />
      ))}
      {!isExpanded && isExpandable && (
        <ShowButton
          type="button"
          variant="text"
          size="medium"
          onClick={() => navigate(url, { state: { expandInPlace: true } })}
        >
          + {showMoreLabel}
        </ShowButton>
      )}
    </GroupPageWrapper>
  );
}

export const GroupPage = compose(withItemId, memo)(GroupPageComponent);

const GroupPageWrapper = styled.div<{ $isExpanded: boolean; $isExpandable: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: calc(var(--spacing-unit) * 16);
  padding-bottom: ${({ $isExpanded, $isExpandable }) =>
    $isExpanded || !$isExpandable ? 'var(--spacing-lg)' : '0'};

  blockquote {
    margin-top: var(--spacing-sm);
  }

  [data-testid="external-documentation"] {
    margin: var(--spacing-xxs) 0 0;
  }

  ${({ $isExpanded, $isExpandable }) =>
    (!$isExpanded || !$isExpandable) &&
    `
    border-bottom: 1px solid var(--border-color-secondary);
  `}

  /* Collapsed operation-groups get the grey layer background; leaf/expanded stay white. */
  ${({ $isExpanded, $isExpandable }) =>
    !$isExpanded &&
    $isExpandable &&
    `
    background-color: var(--layer-color);
    --code-block-bg-color: var(--bg-color);
    --code-block-controls-bg-color: var(--bg-color);
  `}
`;

const ShowButton = styled(Button)`
  margin: var(--spacing-md) var(--spacing-xl) var(--spacing-xxs);
  width: calc(100% - var(--spacing-xl) * 2);

  @media screen and (min-width: ${breakpoints.medium}) {
    --button-margin-md: calc(var(--spacing-xl) * 2);

    margin-left: var(--button-margin-md);
    margin-right: var(--button-margin-md);
    width: calc(100% - var(--button-margin-md) * 2);
  }
`;

const BreadcrumbsContainer = styled.div<{ $isStacked: boolean }>`
  width: 100%;
  min-width: 0;
  padding: var(--spacing-sm) var(--panel-gap-horizontal) 0;

  @media screen and (min-width: ${breakpoints.large}) {
    width: ${({ $isStacked }) => ($isStacked ? '100%' : 'calc(100% - var(--panel-samples-width))')};
    padding-left: calc(var(--panel-gap-horizontal) * 2);
    padding-right: var(--panel-gap-horizontal);
  }
`;
