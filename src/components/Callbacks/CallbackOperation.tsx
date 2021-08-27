import { observer } from 'mobx-react';
import * as React from 'react';

import { OperationModel, ReverseEventsRWOProps } from '../../services/models';
import { StyledCallbackTitle } from './styled.elements';
import { CallbackDetails } from './CallbackDetails';

export interface CallbackOperationProps {
  callbackOperation: OperationModel;
  reverseEventsReadWriteOnly?: ReverseEventsRWOProps;
}

@observer
export class CallbackOperation extends React.Component<CallbackOperationProps> {
  toggle = () => {
    this.props.callbackOperation.toggle();
  };

  render() {
    const { name, expanded, httpVerb, deprecated } = this.props.callbackOperation;
    const { reverseEventsReadWriteOnly } = this.props;

    return (
      <>
        <StyledCallbackTitle
          onClick={this.toggle}
          name={name}
          opened={expanded}
          httpVerb={httpVerb}
          deprecated={deprecated}
        />
        {expanded &&
          <CallbackDetails
            operation={this.props.callbackOperation}
            reverseEventsReadWriteOnly={reverseEventsReadWriteOnly}
          />
        }
      </>
    );
  }
}
