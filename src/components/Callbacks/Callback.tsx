import { observer } from 'mobx-react';
import * as React from 'react';

import { OperationModel } from '../../services/models';
import { CallbackDetailsWrap, StyledCallbackTitle } from '../Callbacks/styled.elements';
import { CallbackDetails } from './CallbackDetails';

@observer
// TODO: rename to Callback
export class CallbackView extends React.Component<{ callbackOperation: OperationModel }> {
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
        {expanded && (
          <CallbackDetailsWrap>
            <CallbackDetails callbackOperation={this.props.callbackOperation} />
          </CallbackDetailsWrap>
        )}
      </>
    );
  }
}
