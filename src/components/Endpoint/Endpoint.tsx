import * as React from 'react';
import { OperationModel } from '../../services';

import {
  EndpointInfo,
  HttpVerb,
  OperationEndpointWrap,
  ServerRelativeURL,
} from './styled.elements';

export interface EndpointProps {
  operation: OperationModel;

  hideHostname?: boolean;
  inverted?: boolean;
  compact?: boolean;
}

export interface EndpointState {
  expanded: boolean;
}

export class Endpoint extends React.Component<EndpointProps, EndpointState> {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    const { operation, inverted } = this.props;
    const { expanded } = this.state;

    return (
      <OperationEndpointWrap>
        <EndpointInfo expanded={expanded} inverted={inverted}>
          <HttpVerb type={operation.httpVerb} compact={this.props.compact}>
            {operation.httpVerb}
          </HttpVerb>
          <ServerRelativeURL>{operation.path}</ServerRelativeURL>
        </EndpointInfo>
      </OperationEndpointWrap>
    );
  }
}
