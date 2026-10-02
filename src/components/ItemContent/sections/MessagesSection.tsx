import { styled } from 'styled-components';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import type { ReactElement } from 'react';
import type { SegmentedOption } from '@redocly/theme/core/openapi';
import type { Node } from '@markdoc/markdoc';
import type { ItemContentNode } from '../../../types/content.js';
import type { DeepLinkSectionValue } from '../../../hooks/useDeepLinkSection.js';

import { Segmented } from '@redocly/theme/components/Segmented/Segmented';
import { breakpoints } from '@redocly/theme/core/openapi';

import { collectMarkdownPlainText } from '../../../adapters/utils/markdoc.js';
import { SECTION_ATTR } from '../../../constants/openapi.js';
import { SchemaView } from '../../Schema/SchemaView.js';
import { VariantDropdown } from '../../Schema/views/VariantDropdown.js';
import { Markdown } from '../../common/Markdown.js';
import { ExternalDocumentation } from '../../common/ExternalDocumentation.js';
import { DeepLinkAnchor, deepLinkHoverReveal } from '../../common/DeepLinkAnchor.js';
import { buildAsyncApiSuffix, getDeepLinkId } from '../../../utils/deep-link.js';
import {
  DeepLinkSectionContext,
  ItemIdContext,
  useDeepLinkUrl,
} from '../../../hooks/useDeepLinkSection.js';
import { isRecord } from '../../../adapters/helpers.js';
import { itemStoreAtom, itemStoreFieldAtom } from '../../../jotai/itemStore.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { RESOURCES, useTelemetry } from '../../../telemetry/index.js';
import { useKeyFromHash } from '../hooks.js';
import { useUrlHashReassert } from '../../../hooks/useUrlHashReassert.js';

type MessageData = NonNullable<ItemContentNode['messages']>[number];

const LIMIT_FOR_SEGMENTED = 3;

export function MessagesSection({ node }: { node: ItemContentNode }): ReactElement {
  const messages = node.messages;
  if (!messages || messages.length === 0) {
    return <></>;
  }

  return <MessagesContent messages={messages} />;
}

function MessagesContent({ messages }: { messages: MessageData[] }): ReactElement {
  const itemId = useContext(ItemIdContext);
  const setItemState = useSetAtom(itemStoreAtom(itemId ?? ''));
  const storedKey = useAtomValue(
    useMemo(() => itemStoreFieldAtom({ itemId: itemId ?? '', key: 'activeMessageKey' }), [itemId]),
  );

  const messageKeys = useMemo(() => messages.map((m) => m.name), [messages]);
  const keyFromHash = useKeyFromHash(itemId ?? undefined, messageKeys, 'm');
  const reassert = useUrlHashReassert();
  const prevHashKey = useRef<string | undefined>(undefined);
  const prevReassert = useRef(reassert);
  const hashJustChanged =
    keyFromHash !== undefined &&
    (keyFromHash !== prevHashKey.current || reassert !== prevReassert.current);

  const activeMessageKey = hashJustChanged ? keyFromHash : storedKey || messages[0].name;
  const selectedMessage = useMemo(
    () => messages.find((m) => m.name === activeMessageKey) ?? messages[0],
    [messages, activeMessageKey],
  );

  useEffect(() => {
    if (keyFromHash) {
      setItemState({ activeMessageKey: keyFromHash });
    }
    prevHashKey.current = keyFromHash;
    prevReassert.current = reassert;
  }, [keyFromHash, reassert, setItemState]);

  const telemetry = useTelemetry();
  const messageOptions = useMemo<SegmentedOption<string>[]>(
    () =>
      messages.map((msg) => ({
        value: msg.name,
        label: msg.label || msg.name,
      })),
    [messages],
  );

  const segmentedRef = useRef<HTMLDivElement>(null);
  const [isAnyItemTruncated, setIsAnyItemTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = (): void => {
      const root = segmentedRef.current;
      if (!root) return;
      const items = root.querySelectorAll('[role="tab"]');
      const isTruncated = Array.from(items).some((item) => {
        const el = item as HTMLElement;
        return el.offsetWidth < el.scrollWidth;
      });
      setIsAnyItemTruncated(isTruncated);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [messageOptions]);

  const useDropdown =
    messages.length > LIMIT_FOR_SEGMENTED || (messages.length > 1 && isAnyItemTruncated);

  const handleSelectKey = useCallback(
    (key: string) => {
      telemetry.sendSwitchMessageClickedMessage([
        {
          ...RESOURCES.switchMessageButton,
          index: messageKeys.indexOf(key),
          total: messageKeys.length,
        },
      ]);
      setItemState({ activeMessageKey: key });
    },
    [telemetry, setItemState, messageKeys],
  );

  const messageSuffix = useMemo(
    () =>
      selectedMessage?.name
        ? buildAsyncApiSuffix({
            section: 'messages',
            messageKey: selectedMessage.name,
          })
        : '',
    [selectedMessage?.name],
  );
  const messageDeepLink = useDeepLinkUrl(messageSuffix);
  const messagesSectionId = useMemo(() => (itemId ? `${itemId}/messages` : undefined), [itemId]);
  const sectionAttrProps = messagesSectionId ? { [SECTION_ATTR]: messagesSectionId } : {};

  return (
    <div {...sectionAttrProps}>
      <MessagesLead>
        {messages.length > 1 ? (
          <>
            Accepts <Accent>one of</Accent> the following messages:
          </>
        ) : (
          <>Accepts the following message:</>
        )}
      </MessagesLead>
      <MessageSwitcher id={getDeepLinkId(messageDeepLink)}>
        {messageDeepLink && (
          <SwitcherDeepLink>
            <DeepLinkAnchor to={messageDeepLink} label="link to Message selector" />
          </SwitcherDeepLink>
        )}
        {useDropdown ? (
          <VariantDropdown
            value={activeMessageKey}
            options={messageOptions}
            onChange={(opt) => {
              if (opt.value !== undefined) {
                handleSelectKey(opt.value);
              }
            }}
          />
        ) : (
          <Segmented
            ref={segmentedRef}
            size="small"
            value={activeMessageKey}
            options={messageOptions}
            onChange={(opt) => {
              if (opt.value !== undefined) {
                handleSelectKey(opt.value);
              }
            }}
          />
        )}
      </MessageSwitcher>
      {selectedMessage && <MessageDetail message={selectedMessage} />}
    </div>
  );
}

function MessageDetail({ message }: { message: MessageData }): ReactElement {
  const translate = useSpecTranslate();
  const headersLabel = translate('header', 'Headers');
  const headersData = useMemo<DeepLinkSectionValue | null>(() => {
    if (!message.name) return null;
    return {
      asyncSection: 'messages',
      messageKey: message.name,
      t: 'headers',
    };
  }, [message.name]);

  const payloadData = useMemo<DeepLinkSectionValue | null>(() => {
    if (!message.name) return null;
    return {
      asyncSection: 'messages',
      messageKey: message.name,
      t: 'payload',
    };
  }, [message.name]);

  const headersSuffix = useMemo(
    () =>
      message.name
        ? buildAsyncApiSuffix({
            section: 'messages',
            messageKey: message.name,
            subsection: 'headers',
          })
        : '',
    [message.name],
  );
  const payloadSuffix = useMemo(
    () =>
      message.name
        ? buildAsyncApiSuffix({
            section: 'messages',
            messageKey: message.name,
            subsection: 'payload',
          })
        : '',
    [message.name],
  );

  const headersDeepLink = useDeepLinkUrl(headersSuffix);
  const payloadDeepLink = useDeepLinkUrl(payloadSuffix);

  const payloadLabel = message.payloadLabel ?? translate('payload', 'Payload');

  const externalDocsPlain =
    message.externalDocs?.description != null
      ? collectMarkdownPlainText(message.externalDocs.description)
      : undefined;

  return (
    <MessageItem>
      {message.summary && <MessageSummary>{message.summary}</MessageSummary>}
      {message.description && (
        <MessageDescription>
          <Markdown source={message.description as Node[]} />
        </MessageDescription>
      )}
      {message.externalDocs?.url && (
        <MessageExternalDocs>
          <ExternalDocumentation
            externalDocs={{
              url: message.externalDocs.url,
              description: externalDocsPlain || undefined,
            }}
            compact
          />
        </MessageExternalDocs>
      )}

      {(message.headerSchemaId || isRecord(message.headers)) && (
        <SchemaBlock id={getDeepLinkId(headersDeepLink)}>
          <SchemaLabel>
            {headersDeepLink && (
              <DeepLinkAnchor to={headersDeepLink} label={`link to ${headersLabel}`} />
            )}
            {headersLabel}
          </SchemaLabel>
          <DeepLinkSectionContext.Provider value={headersData}>
            {message.headerSchemaId ? (
              <SchemaView schemaId={message.headerSchemaId} expandByDefault />
            ) : (
              <SchemaView schema={message.headers} expandByDefault />
            )}
          </DeepLinkSectionContext.Provider>
        </SchemaBlock>
      )}

      {(message.schemaId || isRecord(message.payload)) && (
        <SchemaBlock id={getDeepLinkId(payloadDeepLink)}>
          <SchemaLabel>
            {payloadDeepLink && (
              <DeepLinkAnchor to={payloadDeepLink} label={`link to ${payloadLabel}`} />
            )}
            {payloadLabel}
            {message.contentType && <ContentType>{message.contentType}</ContentType>}
          </SchemaLabel>
          <DeepLinkSectionContext.Provider value={payloadData}>
            {message.schemaId ? (
              <SchemaView schemaId={message.schemaId} expandByDefault />
            ) : (
              <SchemaView schema={message.payload} expandByDefault />
            )}
          </DeepLinkSectionContext.Provider>
        </SchemaBlock>
      )}
    </MessageItem>
  );
}

const MessagesLead = styled.p`
  margin: 0 0 var(--spacing-sm, 12px);
  color: var(--text-color-secondary, #666);
  font-size: var(--font-size-base, 14px);

  @media screen and (max-width: ${breakpoints.small}) {
    margin-top: var(--spacing-xs);
  }
`;

const Accent = styled.span`
  font-weight: var(--font-weight-bold, 700);
`;

const MessageSwitcher = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  ${deepLinkHoverReveal}

  @media screen and (max-width: ${breakpoints.small}) {
    margin-top: var(--spacing-xl);
  }
`;

const SwitcherDeepLink = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const MessageItem = styled.div`
  padding: var(--spacing-xs, 8px) 0;
`;

const MessageSummary = styled.div`
  font-size: var(--font-size-base, 14px);
  color: var(--text-color-secondary, #666);
`;

const MessageDescription = styled.div`
  margin-top: var(--spacing-xxs, 4px);
  font-size: var(--font-size-base, 14px);
  color: var(--text-color-secondary, #666);
`;

const MessageExternalDocs = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
`;

const SchemaBlock = styled.div`
  margin-top: var(--spacing-lg);
`;

const SchemaLabel = styled.h4`
  font-size: var(--font-size-md, 16px);
  font-weight: var(--font-weight-bold, 700);
  color: var(--text-color-primary, #333);
  margin: 0;

  @media screen and (max-width: ${breakpoints.small}) {
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-xs);
  }
  ${deepLinkHoverReveal}
`;

const ContentType = styled.span`
  margin: 0px var(--spacing-xs);
  color: var(--text-color-primary);
  line-height: var(--line-height-lg);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-lg);
`;
