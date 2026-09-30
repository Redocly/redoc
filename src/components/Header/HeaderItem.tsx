import { useMemo, memo, useContext } from 'react';
import { useAtomValue } from 'jotai';
import { styled, css } from 'styled-components';

import type { ReactElement } from 'react';
import type { ContentNode, HeaderNode } from '../../types/content.js';

import { apiSpecType } from '../../types/common.js';

import { H1 as Heading1 } from '@redocly/theme/components/Typography/H1';
import { H2 as Heading2 } from '@redocly/theme/components/Typography/H2';
import { H3 as Heading3 } from '@redocly/theme/components/Typography/H3';
import { H4 as Heading4 } from '@redocly/theme/components/Typography/H4';
import { breakpoints } from '@redocly/theme/core/openapi';

import { useSpecTranslate } from '../../hooks/useTranslate.js';
import { resolveText } from '../../utils/resolveText.js';
import { routingBasePathAtom, specTypeAtom } from '../../jotai/store.js';
import { GraphQLHeaderExtras } from '../graphql/GraphQLHeaderExtras.js';
import { StyledBadge, TextBadge, renderPropertyBadge } from '../common/Badge.js';
import { DeepLinkAnchor, deepLinkHoverReveal } from '../common/DeepLinkAnchor.js';
import { joinWithSeparator, toRelativePath } from '../../utils/url.js';
import { encodeBackSlashes } from '../../utils/string.js';
import { buildDeepLinkUrl, getDeepLinkId } from '../../utils/deep-link.js';
import { useNavigationUrlNormalizer } from '../../hooks/useNormalizeUrl.js';
import { ItemIdContext } from '../../hooks/useDeepLinkSection.js';
import { ArgsCollapsed } from '../graphql/styled.js';
import { ResponsesDeepLinkAnchor } from './ResponseDeepLinkAnchor.js';
import { HeaderResponseCodeTabs } from './HeaderResponseCodeTabs.js';
import { HeaderPageActions } from './HeaderPageActions.js';
import { ExpandAllButton } from '../common/ExpandAllButton.js';
import {
  useHeaderExpandableKeys,
  useResponseCodes,
  useHeaderHasRenderedCollapsibles,
} from './hooks.js';

export type HeaderItemProps = {
  node: HeaderNode;
  path: string;
  parentNode?: ContentNode;
};

function HeaderItemComponent({ node, path, parentNode }: HeaderItemProps): ReactElement | null {
  const {
    level,
    label,
    badges,
    deprecated,
    graphqlReturnType,
    graphqlArgs,
    graphqlDeprecated,
    graphqlOperationType,
    showPageActions = false,
    deepLinkSuffix,
    protocolTag,
    isWebhook,
  } = node;
  const specType = useAtomValue(specTypeAtom);
  const translate = useSpecTranslate();
  const isGraphQL = specType === apiSpecType.GRAPHQL;
  const showDeprecated = deprecated || (isGraphQL && graphqlDeprecated);
  const routingBasePath = useAtomValue(routingBasePathAtom);
  const normalizeUrl = useNavigationUrlNormalizer();
  const itemId = useContext(ItemIdContext);
  const responseCodes = useResponseCodes(parentNode, deepLinkSuffix);
  const firstCode = responseCodes?.[0] || '';
  const title = resolveText(translate, node.labelTranslationKey, node.label);
  const relativePathForLink = useMemo(
    () => (path ? toRelativePath(path, routingBasePath) : ''),
    [path, routingBasePath],
  );
  const itemLink = useMemo(() => {
    if (!relativePathForLink) return '';
    if (deepLinkSuffix) {
      return normalizeUrl(buildDeepLinkUrl(routingBasePath, relativePathForLink, deepLinkSuffix));
    }
    return normalizeUrl(
      joinWithSeparator(routingBasePath, encodeBackSlashes(relativePathForLink.toLowerCase())),
    );
  }, [relativePathForLink, routingBasePath, deepLinkSuffix, normalizeUrl]);
  const isResponsesHeader =
    deepLinkSuffix === 'responses' && !!responseCodes && responseCodes.length > 0 && !!path;

  const expandableKeys = useHeaderExpandableKeys(deepLinkSuffix);
  const hasRenderedCollapsibles = useHeaderHasRenderedCollapsibles(deepLinkSuffix);
  const badgesBefore = useMemo(
    () => badges?.filter((b) => b.position === 'before') ?? [],
    [badges],
  );
  const badgesAfter = useMemo(() => badges?.filter((b) => b.position !== 'before') ?? [], [badges]);

  const deepLinkElement = useMemo(() => {
    if (!itemLink || level <= 1) return null;
    return isResponsesHeader ? (
      <ResponsesDeepLinkAnchor
        routingBasePath={routingBasePath}
        relativePath={relativePathForLink}
        itemId={itemId ?? ''}
        label={`link to ${title}`}
      />
    ) : (
      <DeepLinkAnchor to={itemLink} label={`link to ${title}`} />
    );
  }, [itemLink, level, isResponsesHeader, routingBasePath, relativePathForLink, itemId, title]);

  const renderHeader = useMemo(() => {
    const titleWithBadges = (
      <>
        {deepLinkElement}
        {badgesBefore.map(renderPropertyBadge)}
        {title}
        {badgesAfter.map(renderPropertyBadge)}
      </>
    );

    switch (level) {
      case 1:
        return <H1 $inline={isGraphQL}>{titleWithBadges}</H1>;
      case 2:
        return (
          <H2 $inline={isGraphQL}>
            {titleWithBadges}
            {showDeprecated && (
              <>
                {' '}
                <StyledBadge $deprecated>
                  {translate('badges.deprecated', 'deprecated')}
                </StyledBadge>
              </>
            )}
            {isWebhook && (
              <StyledBadge webhook>{translate('badges.webhook', 'Webhook')}</StyledBadge>
            )}
          </H2>
        );
      case 3:
        return <H3 $inline={isGraphQL}>{titleWithBadges}</H3>;
      case 4:
        return <H4 $inline={isGraphQL}>{titleWithBadges}</H4>;
      case 5:
        return <H5 $inline={isGraphQL}>{titleWithBadges}</H5>;
      default:
        return null;
    }
  }, [
    deepLinkElement,
    badgesBefore,
    title,
    badgesAfter,
    level,
    showDeprecated,
    translate,
    isWebhook,
    isGraphQL,
  ]);

  const spacingBeforeResponsesSection = !isGraphQL && level === 4 && deepLinkSuffix === 'responses';

  return (
    <>
      {protocolTag && (
        <ProtocolTag color={protocolTag.color} borderless>
          {protocolTag.label}
        </ProtocolTag>
      )}
      <HeadingContentWrapper
        id={deepLinkSuffix ? getDeepLinkId(itemLink) : undefined}
        $spacingBeforeResponses={spacingBeforeResponsesSection}
        $isAsyncApi={specType === apiSpecType.ASYNCAPI}
      >
        <HeadingMainArea $badgeCount={responseCodes?.length ?? 0}>
          {isGraphQL ? (
            <GqlTitleWithArgs>
              {renderHeader}
              {graphqlArgs && graphqlArgs.length > 0 && (
                <ArgsCollapsedWrapper data-testid="collapsed-args" $size="lg">
                  ({graphqlArgs.length === 1 ? graphqlArgs[0].name : '...args'})
                </ArgsCollapsedWrapper>
              )}
            </GqlTitleWithArgs>
          ) : (
            renderHeader
          )}
          {responseCodes && responseCodes.length > 0 && (
            <HeaderResponseCodeTabs
              codes={responseCodes}
              itemId={itemId ?? ''}
              firstCode={firstCode}
            />
          )}
          {expandableKeys.length > 0 && hasRenderedCollapsibles && itemId && (
            <ExpandAllButton itemId={itemId} deepLinkKeys={expandableKeys} />
          )}
        </HeadingMainArea>
        {showPageActions && (
          <HeaderPageActionsSlot>
            <HeaderPageActions pageSlug={path || routingBasePath} />
          </HeaderPageActionsSlot>
        )}
      </HeadingContentWrapper>
      {isGraphQL && (
        <GraphQLHeaderExtras
          returnType={graphqlReturnType}
          operationName={label}
          operationType={graphqlOperationType}
        />
      )}
    </>
  );
}

const HeadingContentWrapper = styled.div<{
  $spacingBeforeResponses?: boolean;
  $isAsyncApi?: boolean;
}>`
  container-type: inline-size;
  container-name: api-docs-heading;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-base);
  ${deepLinkHoverReveal}
  margin-bottom: var(--spacing-base);
  flex-wrap: nowrap;
  gap: var(--spacing-xs);

  &:has(h4) {
    margin-bottom: ${({ $spacingBeforeResponses }) =>
      $spacingBeforeResponses ? 'var(--spacing-base)' : 'var(--spacing-xs)'};
  }

  ${({ $isAsyncApi }) =>
    $isAsyncApi &&
    css`
      &:has(h4) {
        margin-top: var(--spacing-md);
        margin-bottom: 0;
      }
    `}

  &:has(+ [data-gql-return-type-details]) {
    margin-bottom: 0;
  }

  ${({ $spacingBeforeResponses }) =>
    $spacingBeforeResponses &&
    css`
      margin-top: var(--spacing-xl);
    `}

  @media screen and (max-width: ${breakpoints.small}) {
    gap: 0;
  }
`;

// Estimated widths used to decide when the header content stops fitting on one row.
const HEADER_ROW_RESERVE = 250; // title + expand/collapse button + gaps
const RESPONSE_BADGE_WIDTH = 64; // one status-code tab

const HeadingMainArea = styled.div<{ $badgeCount?: number }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: var(--spacing-xs);
  flex: 1 1 auto;
  min-width: 0;
  & > *:has(+ [data-response-codes-tablist]) {
    margin-right: var(--spacing-base);
  }

  ${({ $badgeCount }) =>
    !!$badgeCount &&
    css`
      @container api-docs-heading (max-width: ${
        HEADER_ROW_RESERVE + $badgeCount * RESPONSE_BADGE_WIDTH
      }px) {
        & > [data-response-codes-tablist] {
          order: 1;
          flex-basis: 100%;
        }
      }
    `}
`;

const ArgsCollapsedWrapper = styled(ArgsCollapsed)`
  margin-left: var(--spacing-xs);
`;

const HeaderPageActionsSlot = styled.div`
  flex-shrink: 0;
  margin-left: auto;
`;

const ProtocolTag = styled(TextBadge)`
  display: block;
  align-self: flex-start;
  margin-top: var(--spacing-md);
`;

const GqlTitleWithArgs = styled.div`
  display: block;
  min-width: 0;
  flex: 1 1 auto;
`;

const headingFlexStyles = css<{ $inline?: boolean }>`
  overflow-wrap: anywhere;
  word-break: break-word;
  min-width: 0;
  position: relative;
  margin: 0;

  & [data-deep-link-anchor] {
    position: absolute;
    top: 0;
    left: 0;
    height: 1lh;
  }
  ${({ $inline }) =>
    $inline
      ? css`
          display: inline;

          & > [data-component-name='Tag/Tag'] {
            vertical-align: middle;
          }
        `
      : css`
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          flex-wrap: wrap;
        `}
`;

const H1 = styled(Heading1)<{ $inline?: boolean }>`
  ${headingFlexStyles}
  & + [data-component-name="Markdown/Markdown"] {
    margin-top: var(--h1-margin-bottom);
  }
`;

const H2 = styled(Heading2)<{ $inline?: boolean }>`
  ${headingFlexStyles}
`;

const H3 = styled(Heading3)<{ $inline?: boolean }>`
  ${headingFlexStyles}
`;

const H4 = styled(Heading4)<{ $inline?: boolean }>`
  ${headingFlexStyles}
`;

const H5 = styled.h5<{ $inline?: boolean }>`
  ${headingFlexStyles}
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-lg);
  color: var(--text-color-primary);
`;

export const HeaderItem = memo(HeaderItemComponent);
