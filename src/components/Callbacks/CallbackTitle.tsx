import * as React from 'react';

import { ShelfIcon } from '../../common-elements';
import { OperationBadge } from '../SideMenu/styled.elements';
import { shortenHTTPVerb } from '../../utils/openapi';
import styled from '../../styled-components';
import { Badge } from '../../common-elements/';
import { l } from '../../services/Labels';

export interface CallbackTitleProps {
  name: string;
  opened?: boolean;
  className?: string;
  onClick?: () => void;
  httpVerb: string;
  deprecated?: boolean;
}

export class CallbackTitle extends React.PureComponent<CallbackTitleProps> {
  render() {
    const { name, opened, className, onClick, httpVerb, deprecated } = this.props;
    return (
      <CallbackTitleWrapper className={className} onClick={onClick || undefined}>
        <OperationBadgeStyled type={httpVerb}>{shortenHTTPVerb(httpVerb)}</OperationBadgeStyled>
        <ShelfIcon size={'1.5em'} direction={opened ? 'down' : 'right'} float={'left'} />
        <CallbackNameStyled deprecated={deprecated}>{name}</CallbackNameStyled>
        {deprecated ? <Badge type="warning"> {l('deprecated')} </Badge> : null}
      </CallbackTitleWrapper>
    );
  }
}

const CallbackTitleWrapper = styled.div`
  & > * {
    vertical-align: middle;
  }
`;

const CallbackNameStyled = styled.span<{ deprecated?: boolean }>`
  text-decoration: ${props => (props.deprecated ? 'line-through' : 'none')};
  margin-right: 8px;
`;

const OperationBadgeStyled = styled(OperationBadge)`
  margin: 0px 5px 0px 0px;
`;
