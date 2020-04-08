import * as React from 'react';

import styled from '../../styled-components';
import { DropdownProps } from '../../common-elements';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { OperationModel } from '../../services/models';
import { XPayloadSample } from '../../services/models/Operation';
import { isPayloadSample } from '../../services';

export interface PayloadSampleProps {
  callback: OperationModel;
  renderDropdown: (props: DropdownProps) => JSX.Element;
}

export class CallbackPayloadSample extends React.Component<PayloadSampleProps> {
  render() {
    const payloadSample = this.props.callback.codeSamples.find(sample =>
      isPayloadSample(sample),
    ) as XPayloadSample | undefined;

    if (!payloadSample) {
      return null;
    }

    return (
      <PayloadSampleWrapper>
        <PayloadSamples content={payloadSample.requestBodyContent} />
      </PayloadSampleWrapper>
    );
  }
}

export const PayloadSampleWrapper = styled.div`
  margin-top: 15px;
`;
