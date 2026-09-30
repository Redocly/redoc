import { memo } from 'react';
import { styled } from 'styled-components';
import { useAtomValue } from 'jotai';
import { Link } from 'react-router';

import type { ReactElement } from 'react';
import type { MessageLinksNode } from '../types/content.js';

import { Tag } from '@redocly/theme/components/Tag/Tag';
import { ArrowUpRightIcon } from '@redocly/theme/icons/ArrowUpRightIcon/ArrowUpRightIcon';

import { routingBasePathAtom } from '../jotai/store.js';
import { buildAsyncApiSuffix, buildDeepLinkUrl } from '../utils/deep-link.js';
import { stripLeadingSlash } from '../utils/url.js';
import { useNavigationUrlNormalizer } from '../hooks/useNormalizeUrl.js';
import { RESOURCES, useTelemetry } from '../telemetry/index.js';

function MessageLinksItemComponent({ node }: { node: MessageLinksNode }): ReactElement | null {
  const routingBasePath = useAtomValue(routingBasePathAtom);
  const normalizeUrl = useNavigationUrlNormalizer();
  const telemetry = useTelemetry();

  const handleClick = (index: number): void => {
    telemetry.sendMessageClickedMessage([
      {
        ...RESOURCES.messageLink,
        index,
        total: node.messages.length,
      },
    ]);
  };

  const buildMessageUrl = (messageKey: string): string =>
    normalizeUrl(
      buildDeepLinkUrl(
        routingBasePath,
        stripLeadingSlash(node.channelLink),
        buildAsyncApiSuffix({ section: 'messages', messageKey }),
      ),
    );

  if (!node.messages.length) return null;

  return (
    <Wrapper data-component-name="Operation/MessageLinks">
      <Header>Messages</Header>
      <TagList>
        {node.messages.map((message, index) => (
          <TagLink
            key={message.name}
            to={buildMessageUrl(message.name)}
            onClick={() => handleClick(index)}
          >
            <MessageTag borderless textTransform="none">
              {message.label}
              <ArrowUpRightIcon size="12px" />
            </MessageTag>
          </TagLink>
        ))}
      </TagList>
    </Wrapper>
  );
}

export const MessageLinksItem = memo(MessageLinksItemComponent);

const Wrapper = styled.div`
  margin-top: var(--spacing-sm);
`;

const Header = styled.div`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-base);
  margin: 0;
`;

const TagList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) 0;
`;

const TagLink = styled(Link)`
  display: flex;
  color: inherit;
  text-decoration: none;

  &:visited,
  &:hover {
    color: inherit;
    text-decoration: none;
  }
`;

const MessageTag = styled(Tag)`
  background-color: var(--layer-color-hover);
  color: inherit;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xxs);
`;
