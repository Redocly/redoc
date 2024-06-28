import * as React from 'react';

import { darken } from 'polished';
import { ShelfIcon } from '../../common-elements';
import { OperationBadge } from '../SideMenu/styled.elements';
import { shortenHTTPVerb } from '../../utils/openapi';
import styled from '../../styled-components';
import { Badge } from '../../common-elements/';
import { l } from '../../services/Labels';

export interface CallbackTitleProps {
  name: string;
  opened?: boolean;
  httpVerb: string;
  deprecated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CallbackTitle = (props: CallbackTitleProps) => {
  const { name, opened, className, onClick, httpVerb, deprecated } = props;

  return (
    <CallbackTitleWrapper className={className} onClick={onClick || undefined}>
      <OperationBadgeStyled type={httpVerb}>{shortenHTTPVerb(httpVerb)}</OperationBadgeStyled>
      <ShelfIcon size={'1.5em'} direction={opened ? 'down' : 'right'} float={'left'} />
      <CallbackName $deprecated={deprecated}>{name}</CallbackName>
      {deprecated ? <Badge type="warning"> {l('deprecated')} </Badge> : null}
    </CallbackTitleWrapper>
  );
};

const CallbackTitleWrapper = styled.button`
  border: 0;
  width: 100%;
  text-align: left;
  & > * {
    vertical-align: middle;
  }

  ${ShelfIcon} {
    polygon {
      fill: ${({ theme }) => darken(theme.colors.tonalOffset, theme.colors.gray[100])};
    }
  }
`;

const CallbackName = styled.span<{ $deprecated?: boolean }>`
  text-decoration: ${props => (props.$deprecated ? 'line-through' : 'none')};
  margin-right: 8px;
`;

const OperationBadgeStyled = styled(OperationBadge)`
  margin: 0 5px 0 0;
`;
