import * as React from 'react';

import { OperationModel } from '../../services/models';
import { OperationItem } from '../ContentItems/ContentItems';
import { Endpoint } from '../Endpoint/Endpoint';
import { Markdown } from '../Markdown/Markdown';
import styled from '../../styled-components';

export class CallbackDetails extends React.PureComponent<{ callbackOperation: OperationModel }> {
  render() {
    const description = this.props.callbackOperation.description;

    return (
      <div>
        {description && (
          <CallbackDescription>
            <Markdown compact={true} inline={true} source={description} />
          </CallbackDescription>
        )}
        <Endpoint operation={this.props.callbackOperation} inverted={true} compact={true} />
        <OperationItem item={this.props.callbackOperation} />
      </div>
    );
  }
}

const CallbackDescription = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`;
