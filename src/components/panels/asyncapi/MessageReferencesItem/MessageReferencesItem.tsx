import { styled } from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useContext, useMemo, type ReactElement } from 'react';
import { Link } from 'react-router';

import type {
  MessageReferencesNode,
  MessageReferencesGroups,
  MessageChannelReference,
} from '../../../../types/content.js';

import { Panel } from '@redocly/theme/components/Panel/Panel';
import { Typography } from '@redocly/theme/components/Typography/Typography';

import { ListIcon } from '../../../../icons/ListIcon/ListIcon.js';
import { visitedChannelsAtom } from '../../../../jotai/app.js';
import { itemStoreFieldAtom } from '../../../../jotai/itemStore.js';
import { ItemIdContext } from '../../../../hooks/useDeepLinkSection.js';
import { useNavigationUrlNormalizer } from '../../../../hooks/useNormalizeUrl.js';
import { RESOURCES, useTelemetry } from '../../../../telemetry/index.js';
import { markNavigationCauseAtom } from '../../../../jotai/telemetry.js';

function buildHeaderText(groups: MessageReferencesGroups): string {
  const parts: string[] = [];
  if (groups.exchanges.length > 0) {
    parts.push(`${groups.exchanges.length} exchange${groups.exchanges.length > 1 ? 's' : ''}`);
  }
  if (groups.queues.length > 0) {
    parts.push(`${groups.queues.length} queue${groups.queues.length > 1 ? 's' : ''}`);
  }
  if (parts.length === 0) return '';
  return `Used in ${parts.join(' and ')}`;
}

type MessageReferenceRowProps = {
  reference: MessageChannelReference;
  to: string;
  isActive: boolean;
  onReferencedInClick: (referencedIn: string) => void;
};

const MessageReferenceRow = memo(function MessageReferenceRow({
  reference,
  to,
  isActive,
  onReferencedInClick,
}: MessageReferenceRowProps): ReactElement {
  const handleClick = useCallback(
    () => onReferencedInClick(reference.label),
    [onReferencedInClick, reference.label],
  );

  return (
    <ChannelLinkRow>
      <StyledListIcon
        size="22px"
        color={isActive ? 'var(--color-info-border)' : 'var(--border-color-primary)'}
      />
      <ChannelLink to={to} onClick={handleClick}>
        {reference.label}
      </ChannelLink>
    </ChannelLinkRow>
  );
});

export function MessageReferencesPanelItem({
  node,
}: {
  node: MessageReferencesNode;
}): ReactElement {
  const referencesItem = node.children[0];
  const itemId = useContext(ItemIdContext) ?? '';
  const visitedChannels = useAtomValue(visitedChannelsAtom);
  const isChannelVisited = useCallback(
    (key: string): boolean =>
      (visitedChannels ?? []).some((path) => path.endsWith(key.toLowerCase())),
    [visitedChannels],
  );
  const normalizeUrl = useNavigationUrlNormalizer();
  const telemetry = useTelemetry();
  const markNavigationCause = useSetAtom(markNavigationCauseAtom);
  const activeMessageKey = useAtomValue(
    useMemo(() => itemStoreFieldAtom({ itemId, key: 'activeMessageKey' }), [itemId]),
  );
  const fireReferencedIn = useCallback((): void => {
    markNavigationCause('referencedIn');
    telemetry.sendReferencedInClickedMessage([
      {
        ...RESOURCES.asyncapiDocsChannelLink,
        fromKind: 'channel',
        toKind: 'channel',
      },
    ]);
  }, [telemetry, markNavigationCause]);

  if (!referencesItem) {
    return <></>;
  }

  const { referencesByMessageKey } = referencesItem;
  const messageKeys = Object.keys(referencesByMessageKey);
  const resolvedKey =
    activeMessageKey && referencesByMessageKey[activeMessageKey]
      ? activeMessageKey
      : messageKeys[0];
  const groups = resolvedKey ? referencesByMessageKey[resolvedKey] : undefined;

  if (!groups || (groups.exchanges.length === 0 && groups.queues.length === 0)) {
    return <></>;
  }

  const headerText = buildHeaderText(groups);
  const normalizedExchanges = groups.exchanges.map((reference) => ({
    reference,
    to: normalizeUrl(reference.link),
  }));
  const normalizedQueues = groups.queues.map((reference) => ({
    reference,
    to: normalizeUrl(reference.link),
  }));

  return (
    <StyledPanel header={headerText} className="panel-api-docs" isExpandable={false}>
      {normalizedExchanges.length > 0 && (
        <Section>
          <SectionTitle>Exchanges</SectionTitle>
          {normalizedExchanges.map(({ reference, to }) => {
            const isActive = isChannelVisited(reference.key);
            return (
              <MessageReferenceRow
                key={reference.key}
                reference={reference}
                to={to}
                isActive={isActive}
                onReferencedInClick={fireReferencedIn}
              />
            );
          })}
        </Section>
      )}
      {normalizedQueues.length > 0 && (
        <Section>
          <SectionTitle>Queues</SectionTitle>
          {normalizedQueues.map(({ reference, to }) => {
            const isActive = isChannelVisited(reference.key);
            return (
              <MessageReferenceRow
                key={reference.key}
                reference={reference}
                to={to}
                isActive={isActive}
                onReferencedInClick={fireReferencedIn}
              />
            );
          })}
        </Section>
      )}
    </StyledPanel>
  );
}

const StyledPanel = styled(Panel)`
  [data-component-name='Panel/PanelBody'] {
    background-color: var(--layer-color-ontonal);
    padding: 0;
    display: flex;
    flex-direction: column;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xxs) 0;

  &:not(:last-child) {
    border-bottom: var(--panel-border-local);
  }
`;

const SectionTitle = styled(Typography)`
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  padding: var(--spacing-xxs) var(--spacing-md);
`;

const ChannelLinkRow = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-xxs) var(--spacing-md);
`;

const StyledListIcon = styled(ListIcon)`
  margin-right: var(--spacing-xs);
  flex-shrink: 0;
`;

const ChannelLink = styled(Link)`
  text-decoration: var(--link-decoration);
  color: var(--link-color-primary);
  font-weight: var(--link-font-weight);
  font-size: var(--font-size-base);

  &:visited {
    color: var(--link-color-visited);
    text-decoration: var(--link-decoration-visited);
  }

  &:hover {
    color: var(--link-color-primary-hover);
    text-decoration: var(--link-decoration-hover);
  }
`;
