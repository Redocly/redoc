import * as React from 'react';

import { OperationModel } from '../../services/models';
import { OperationItem } from '../ContentItems/ContentItems';
import { Endpoint } from '../Endpoint/Endpoint';

export class CallbackDetails extends React.PureComponent<{ callbackOperation: OperationModel }> {
  render() {
    return (
      <div>
        <Endpoint operation={this.props.callbackOperation} inverted={true} />
        <OperationItem item={this.props.callbackOperation} />
      </div>
    );
  }
}
