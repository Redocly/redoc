import { observer } from 'mobx-react';
import * as React from 'react';
import { OperationModel } from '../../services/models';
import { CallbackDetails } from './CallbackDetails';
import { CallbackDetailsWrap, StyledCallbackTitle } from '../Callbacks/styled.elements';

@observer
export class CallbackView extends React.Component<{ callbackOperation: OperationModel }> {
  toggle = () => {
    this.props.callbackOperation.toggle();
  };

  render() {
    const { name, description, expanded } = this.props.callbackOperation;

    return (
      <div>
        <StyledCallbackTitle
          onClick={this.toggle}
          name={name}
          description={description}
          opened={expanded}
        />
        {expanded && (
          <CallbackDetailsWrap>
            <CallbackDetails callbackOperation={this.props.callbackOperation} />
          </CallbackDetailsWrap>
        )}
      </div>
    );
  }
}
