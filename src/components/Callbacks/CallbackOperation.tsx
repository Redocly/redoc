import { observer } from 'mobx-react';
import * as React from 'react';

import { OperationModel } from '../../services/models';
import { StyledCallbackTitle } from './styled.elements';
import { CallbackDetails } from './CallbackDetails';

@observer
export class CallbackOperation extends React.Component<{ callbackOperation: OperationModel }> {
  toggle = () => {
    this.props.callbackOperation.toggle();
  };

  render() {
    const { name, expanded, httpVerb, deprecated } = this.props.callbackOperation;

    return (
      <>
        <StyledCallbackTitle
          onClick={this.toggle}
          name={name}
          opened={expanded}
          httpVerb={httpVerb}
          deprecated={deprecated}
        />
        {expanded && <CallbackDetails operation={this.props.callbackOperation} />}
      </>
    );
  }
}
