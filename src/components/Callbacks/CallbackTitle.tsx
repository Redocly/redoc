import * as React from 'react';

import { ShelfIcon } from '../../common-elements';
import { OperationBadge } from '../SideMenu/styled.elements';
import { shortenHTTPVerb } from '../../utils/openapi';
import styled from '../../styled-components';
import { Badge } from '../../common-elements/';
import { l } from '../../services/Labels';
import { OperationModel } from '../../services/models';

export interface CallbackTitleProps {
  className?: string;
  onClick?: () => void;
  callbackOperation: OperationModel;
}

export class CallbackTitle extends React.PureComponent<CallbackTitleProps> {
  render() {
    const { className, onClick, callbackOperation } = this.props;
    const { name, httpVerb, deprecated, expanded } = callbackOperation;

    return (
      <CallbackTitleWrapper className={className} onClick={onClick || undefined}>
        <OperationBadgeStyled type={httpVerb}>{shortenHTTPVerb(httpVerb)}</OperationBadgeStyled>
        <ShelfIcon size={'1.5em'} direction={expanded ? 'down' : 'right'} float={'left'} />
        <CallbackName deprecated={deprecated}>{name}</CallbackName>
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

const CallbackName = styled.span<{ deprecated?: boolean }>`
  text-decoration: ${props => (props.deprecated ? 'line-through' : 'none')};
  margin-right: 8px;
`;

const OperationBadgeStyled = styled(OperationBadge)`
  margin: 0px 5px 0px 0px;
`;
