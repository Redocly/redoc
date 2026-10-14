import { memo } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { ChannelAddressNode } from '../types/content.js';

import { Tag, ContentWrapper } from '@redocly/theme/components/Tag/Tag';
import { CurveAutoColonIcon } from '@redocly/theme/icons/CurveAutoColonIcon/CurveAutoColonIcon';

function ChannelAddressItemComponent({ node }: { node: ChannelAddressNode }): ReactElement {
  return (
    <Row data-component-name="ChannelAddress/ChannelAddressItem" data-testid="channel-address">
      <IconBubble>
        <CurveAutoColonIcon size="14px" />
      </IconBubble>
      <AddressTag borderless>
        name: <span>{node.address}</span>
      </AddressTag>
    </Row>
  );
}

export const ChannelAddressItem = memo(ChannelAddressItemComponent);

const Row = styled.div`
  display: flex;
  gap: var(--spacing-xxs);
  align-items: flex-start;
  margin: 0 0 var(--spacing-sm) 0;
`;

const IconBubble = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: var(--layer-color-hover);
`;

const AddressTag = styled(Tag)`
  margin: 0;
  min-width: 0;
  background-color: var(--layer-color-hover);
  color: inherit;
  text-transform: none;

  & ${ContentWrapper} {
    display: block;
    text-wrap: wrap;
    overflow-wrap: anywhere;
  }

  & span {
    font-weight: var(--font-weight-semibold);
  }
`;
