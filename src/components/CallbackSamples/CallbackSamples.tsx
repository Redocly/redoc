import { observer } from 'mobx-react';
import * as React from 'react';

import { RightPanelHeader } from '../../common-elements';
import { RedocNormalizedOptions } from '../../services';
import { CallbackModel } from '../../services/models';
import { OptionsContext } from '../OptionsProvider';
import { CallbacksSwitch } from '../CallbacksSwitch/CallbacksSwitch';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { InvertedSimpleDropdown, MimeLabel } from '../PayloadSamples/styled.elements';
import { CallbackReqSamples } from './CallbackReqSamples';
import { SamplesWrapper } from './styled.elements';

export interface CallbackSamplesProps {
  callbacks: CallbackModel[];
}

@observer
export class CallbackSamples extends React.Component<CallbackSamplesProps> {
  static contextType = OptionsContext;
  context: RedocNormalizedOptions;

  private renderDropdown = props => {
    return <DropdownOrLabel Label={MimeLabel} Dropdown={InvertedSimpleDropdown} {...props} />;
  };

  render() {
    const { callbacks } = this.props;

    const operations = callbacks
      .map(callback => callback.operations.map(operation => operation))
      .reduce((a, b) => a.concat(b), []);

    // Sums number of code samples per operation per callback
    const numSamples = operations.reduce(
      (sampleSum, operation) => sampleSum + operation.codeSamples.length,
      0,
    );

    const hasSamples = numSamples > 0;

    return (
      (hasSamples && (
        <div>
          <RightPanelHeader> Callback request samples </RightPanelHeader>

          <SamplesWrapper>
            <CallbacksSwitch
              callbacks={operations}
              renderDropdown={this.renderDropdown}
              withLabel={true}
            >
              {callback => (
                <CallbackReqSamples
                  key="callbackReqSamples"
                  callback={callback}
                  renderDropdown={this.renderDropdown}
                />
              )}
            </CallbacksSwitch>
          </SamplesWrapper>
        </div>
      )) ||
      null
    );
  }
}
