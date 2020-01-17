import * as React from 'react';

import { OperationModel } from '../../services/models';
import { OperationItem } from '../ContentItems/ContentItems';

export class CallbackDetails extends React.PureComponent<{ callbackOperation: OperationModel }> {
  render() {
    return <OperationItem item={this.props.callbackOperation} />;
  }
}
