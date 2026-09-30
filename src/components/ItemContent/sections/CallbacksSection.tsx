import { useCallback, useContext, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';

import type { BaseSyntheticEvent, ReactElement } from 'react';
import type { Node } from '@markdoc/markdoc';
import type { ItemContentNode, ContentNode } from '../../../types/content.js';

import { Panel } from '@redocly/theme/components/Panel/Panel';
import { PanelHeader } from '@redocly/theme/components/Panel/PanelHeader';
import { PanelHeaderTitle } from '@redocly/theme/components/Panel/PanelHeaderTitle';

import { TextBadge, StyledBadge } from '../../common/Badge.js';
import {
  DeepLinkAnchor,
  deepLinkHoverReveal,
  DEEP_LINK_ANCHOR_ATTR,
} from '../../common/DeepLinkAnchor.js';
import { ItemContentRenderer } from '../ItemContentRenderer.js';
import { nodeTypes } from '../../../types/common.js';
import { itemStoreAtom, itemStoreFieldAtom } from '../../../jotai/itemStore.js';
import {
  CallbackScopeContext,
  ItemIdContext,
  useDeepLinkUrl,
  useHashItemId,
} from '../../../hooks/useDeepLinkSection.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { useUrlHash } from '../../../hooks/useUrlHash.js';
import {
  buildOpenApiSectionSuffix,
  CALLBACKS_SECTION,
  CALLBACK_REQUEST_SECTION,
  CALLBACK_RESPONSE_SECTION,
  getDeepLinkId,
  hashTargetsCallback,
} from '../../../utils/deep-link.js';
import { Markdown } from '../../common/Markdown.js';
import { collectMarkdownPlainText } from '../../../adapters/utils/markdoc.js';

type CallbackOperation = {
  httpVerb: string;
  pathName: string;
  summary?: string;
  operationId?: string;
  description?: Node | Node[];
  deprecated?: boolean;
  callbackName: string;
  callbackId: string;
  externalDocs?: { url: string; description?: string };
  extensions?: Record<string, unknown>;
  contentChildren?: ContentNode[];
};

function shortenHTTPVerb(verb: string): string {
  return ({ delete: 'del', options: 'opts' } as Record<string, string>)[verb] || verb;
}

/** The deep-link icon sits in the panel header, and its click target is the svg inside the
 *  anchor — so `instanceof HTMLAnchorElement` (what Panel checks) misses it and following a
 *  callback's own link would collapse the panel. */
function isAnchorClick(event: BaseSyntheticEvent): boolean {
  return event.target instanceof Element && event.target.closest('a') !== null;
}

function CallbackOperationItem({
  operation,
  callbackId,
  isExpanded,
  onToggle,
}: {
  operation: CallbackOperation;
  callbackId: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}): ReactElement {
  const {
    httpVerb,
    pathName,
    summary,
    operationId,
    description,
    deprecated,
    contentChildren,
    externalDocs,
    extensions,
  } = operation;
  const displayName =
    summary ||
    operationId ||
    (description && collectMarkdownPlainText(description).substring(0, 50)) ||
    pathName ||
    '<no summary>';

  const cbScopeSuffix = buildOpenApiSectionSuffix(CALLBACKS_SECTION, callbackId);
  const cbDeepLink = useDeepLinkUrl(cbScopeSuffix);
  const headerRef = useRef<HTMLDivElement>(null);

  const cbRequestDeepLink = useDeepLinkUrl(`${cbScopeSuffix}/${CALLBACK_REQUEST_SECTION}`);
  const cbResponseDeepLink = useDeepLinkUrl(`${cbScopeSuffix}/${CALLBACK_RESPONSE_SECTION}`);
  const translate = useSpecTranslate();
  const callbackRequestLabel = translate('callbackRequest', 'Callback Request');
  const callbackResponseLabel = translate('callbackResponse', 'Callback Response');
  const deprecatedLabel = translate('badges.deprecated', 'deprecated');

  return (
    <CallbackPanel
      header={({ expanded, toggle }) => (
        <CallbackHeader
          ref={headerRef}
          expanded={expanded}
          toggle={(e) => {
            if (isAnchorClick(e)) return;
            toggle?.(e);
            onToggle(callbackId);
          }}
          id={getDeepLinkId(cbDeepLink)}
        >
          {cbDeepLink && <DeepLinkAnchor to={cbDeepLink} label={`link to ${displayName}`} />}
          <Trigger>
            <CircleIconWrap type="button" aria-expanded={expanded} aria-label={displayName}>
              <CircleIcon $expanded={expanded} aria-hidden="true" />
            </CircleIconWrap>
            <TitleWrap>
              <CallbackTitle $deprecated={deprecated}>{displayName}</CallbackTitle>
              <HttpVerb color={httpVerb}>{shortenHTTPVerb(httpVerb)}</HttpVerb>
              {deprecated ? <StyledBadge $deprecated>{deprecatedLabel}</StyledBadge> : null}
            </TitleWrap>
          </Trigger>
        </CallbackHeader>
      )}
      expanded={isExpanded}
      className="panel-response-callback"
    >
      <CallbackDetailsWrap>
        {description && (
          <DescriptionWrap>
            <Markdown source={description} />
          </DescriptionWrap>
        )}
        {externalDocs && (
          <ExternalDocsLink href={externalDocs.url} target="_blank" rel="noopener noreferrer">
            {externalDocs.description || externalDocs.url}
          </ExternalDocsLink>
        )}
        {extensions && Object.keys(extensions).length > 0 && (
          <ExtensionsWrap>
            {Object.entries(extensions).map(([key, value]) => (
              <ExtensionEntry key={key}>
                <strong>{key}:</strong> {typeof value === 'string' ? value : JSON.stringify(value)}
              </ExtensionEntry>
            ))}
          </ExtensionsWrap>
        )}
        {contentChildren && contentChildren.length > 0 && (
          <CallbackScopeContext.Provider value={callbackId}>
            <DetailTitle id={getDeepLinkId(cbRequestDeepLink)}>
              {cbRequestDeepLink && (
                <DeepLinkAnchor to={cbRequestDeepLink} label={`link to ${callbackRequestLabel}`} />
              )}
              {callbackRequestLabel}
            </DetailTitle>
            {contentChildren
              .filter(
                (child) =>
                  child.nodeType === nodeTypes.ITEM &&
                  (child as ItemContentNode).variant !== 'responses',
              )
              .map((child, idx) => (
                <ItemContentRenderer key={idx} node={child as ItemContentNode} />
              ))}

            {contentChildren
              .filter(
                (child) =>
                  child.nodeType === nodeTypes.ITEM &&
                  (child as ItemContentNode).variant === 'responses',
              )
              .map((child, idx) => (
                <div key={`resp-${idx}`}>
                  <DetailTitle id={getDeepLinkId(cbResponseDeepLink)}>
                    {cbResponseDeepLink && (
                      <DeepLinkAnchor
                        to={cbResponseDeepLink}
                        label={`link to ${callbackResponseLabel}`}
                      />
                    )}
                    {callbackResponseLabel}
                  </DetailTitle>
                  <ItemContentRenderer node={child as ItemContentNode} />
                </div>
              ))}
          </CallbackScopeContext.Provider>
        )}
        <LeftBorder />
      </CallbackDetailsWrap>
    </CallbackPanel>
  );
}

export function CallbacksSection({ node }: { node: ItemContentNode }): ReactElement {
  const op = node.callback as CallbackOperation | undefined;
  const itemId = useContext(ItemIdContext) ?? '';
  const selectedCallback = useAtomValue(itemStoreFieldAtom({ itemId, key: 'selectedCallback' }));
  const setItemState = useSetAtom(itemStoreAtom(itemId));
  const hash = useUrlHash();
  const hashItemId = useHashItemId();
  const callbackId = op?.callbackId;
  const targetedCallbackId = hashTargetsCallback(hash, hashItemId, callbackId)
    ? callbackId
    : undefined;

  useEffect(() => {
    if (targetedCallbackId) {
      setItemState({ selectedCallback: targetedCallbackId });
    }
  }, [targetedCallbackId, setItemState]);

  const handleToggle = useCallback(
    (id: string) => {
      setItemState((current) => ({ selectedCallback: current.selectedCallback === id ? '' : id }));
    },
    [setItemState],
  );

  if (!op) {
    return <></>;
  }

  return (
    <div>
      <CallbackOperationItem
        key={op.callbackId}
        operation={op}
        callbackId={op.callbackId}
        isExpanded={selectedCallback === op.callbackId}
        onToggle={handleToggle}
      />
    </div>
  );
}

const Trigger = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  max-width: calc(100% - 9px - var(--spacing-unit));
  justify-content: flex-start;
`;

const TitleWrap = styled.div`
  flex: 1;
  min-width: 0;
  line-height: var(--line-height-base);
`;

const CallbackPanel = styled(Panel)`
  border-bottom: 1px solid var(--border-color-primary);
  border-radius: 0;
  &:not(:last-child) {
    margin-bottom: 0;
  }
`;

const CallbackHeader = styled(PanelHeader)`
  padding: var(--spacing-sm) 0 var(--spacing-sm) calc(var(--spacing-unit) / 2);
  margin: 0;
  border-radius: 0;
  line-height: var(--line-height-base);
  position: relative;

  & > [${DEEP_LINK_ANCHOR_ATTR}] {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }

  ${deepLinkHoverReveal}
`;

const CircleIconWrap = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  gap: var(--spacing-xxs);
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  line-height: var(--line-height-base);
`;

const CircleIcon = styled.span<{ $expanded?: boolean }>`
  position: relative;
  display: inline-block;
  flex: none;
  width: 20px;
  height: 20px;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color-primary);
  border-radius: 50%;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--text-color-secondary);
    border-radius: var(--border-width);
  }

  &::before {
    width: var(--spacing-xs);
    height: var(--border-width);
  }

  &::after {
    width: var(--border-width);
    height: var(--spacing-xs);
    opacity: ${({ $expanded }) => ($expanded ? 0 : 1)};
  }
`;

const CallbackTitle = styled(PanelHeaderTitle)<{ $deprecated?: boolean }>`
  text-decoration: ${({ $deprecated }) => ($deprecated ? 'line-through' : 'none')};
  display: inline;
  margin: 0 4px 0 0;
  color: var(--panel-response-callback-heading-text-color);
  font-weight: var(--font-weight-medium);
  word-break: break-all;
`;

const HttpVerb = styled(TextBadge)`
  white-space: nowrap;
  vertical-align: middle;
`;

const CallbackDetailsWrap = styled.div`
  position: relative;
  .property:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const LeftBorder = styled.div`
  position: absolute;
  height: calc(100% + 15px);
  border-left: 1px solid var(--border-color-primary);
  top: -15px;
  left: -13px;
  z-index: 0;
`;

const DescriptionWrap = styled.div`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-primary);
  margin-bottom: var(--spacing-sm);

  p:first-of-type {
    margin-top: 0;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
`;

const ExternalDocsLink = styled.a`
  display: inline-block;
  font-size: var(--font-size-sm);
  color: var(--link-color-primary);
  margin-bottom: var(--spacing-sm);
`;

const ExtensionsWrap = styled.div`
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
`;

const ExtensionEntry = styled.div`
  padding: var(--spacing-xxs) 0;
`;

const DetailTitle = styled.h4`
  position: relative;
  font-size: var(--h4-font-size);
  font-weight: var(--h4-font-weight);
  line-height: var(--h4-line-height);
  padding: 0;
  color: var(--h4-text-color);
  display: flex;
  align-items: center;
  margin: var(--spacing-sm) 0 var(--spacing-xs) 0;
  ${deepLinkHoverReveal}
`;
