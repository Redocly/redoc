import * as React from 'react';

import { DropdownProps } from '../../common-elements';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { OperationModel } from '../../services/models';
import { XPayloadSample } from '../../services/models/Operation';
import { isPayloadSample } from '../../services';
import { ReqSamplesWrapper } from './styled.elements';

export interface PayloadSamplesProps {
  callback: OperationModel;
  renderDropdown: (props: DropdownProps) => JSX.Element;
}

export class CallbackReqSamples extends React.Component<PayloadSamplesProps> {
  render() {
    const payloadSample = this.props.callback.codeSamples.find(sample =>
      isPayloadSample(sample),
    ) as XPayloadSample | undefined;

    return (
      <>
        {payloadSample ? (
          <ReqSamplesWrapper>
            <PayloadSamples content={payloadSample.requestBodyContent} />
          </ReqSamplesWrapper>
        ) : null}
      </>
    );
  }
}
