import { ComponentWithOptions } from '../OptionsProvider';
import * as React from 'react';
import { OperationModel } from '../../services';
import { ShelfIcon } from '../../common-elements';
import { SelectOnClick } from '../SelectOnClick/SelectOnClick';

import {
  OperationEndpointWrap,
  EndpointInfo,
  HttpVerb,
  ServerRelativeURL,
  ServersOverlay,
  ServerItem,
  ServerUrl,
} from './styled.elements';

export interface EndpointProps {
  operation: OperationModel;

  hideHostname?: boolean;
  inverted?: boolean;
}

export interface EndpointState {
  expanded: boolean;
}

export class Endpoint extends ComponentWithOptions<EndpointProps, EndpointState> {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { operation, inverted } = this.props;
    const { expanded } = this.state;

    const hideHostname = this.props.hideHostname || this.options.hideHostname;

    // TODO: highlight server variables, e.g. https://{user}.test.com
    return (
      <OperationEndpointWrap>
        <EndpointInfo onClick={this.toggle} expanded={expanded} inverted={inverted}>
          <HttpVerb type={operation.httpVerb}> {operation.httpVerb}</HttpVerb>{' '}
          <ServerRelativeURL>{operation.path}</ServerRelativeURL>
          <ShelfIcon
            float={'right'}
            color={inverted ? 'black' : 'white'}
            size={'20px'}
            direction={expanded ? 'up' : 'down'}
            style={{ marginRight: '-25px' }}
          />
        </EndpointInfo>
        <ServersOverlay expanded={expanded}>
          {operation.servers.map(server => (
            <ServerItem key={server.url}>
              <div>{server.description}</div>
              <SelectOnClick>
                <ServerUrl>
                  {!hideHostname && <span>{server.url}</span>}
                  {operation.path}
                </ServerUrl>
              </SelectOnClick>
            </ServerItem>
          ))}
        </ServersOverlay>
      </OperationEndpointWrap>
    );
  }
}
