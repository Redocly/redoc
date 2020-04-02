import { observer } from 'mobx-react';
import * as React from 'react';

import styled from '../../styled-components';
import { RightPanelHeader } from '../../common-elements';
import { RedocNormalizedOptions } from '../../services';
import { CallbackModel } from '../../services/models';
import { OptionsContext } from '../OptionsProvider';
import { GenericDropdown } from '../GenericDropdown/GenericDropdown';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { InvertedSimpleDropdown, MimeLabel } from '../PayloadSamples/styled.elements';
import { CallbackReqSamples } from './CallbackReqSamples';

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

    if (!callbacks || callbacks.length === 0) {
      return null;
    }

    const operations = callbacks
      .map(callback => callback.operations.map(operation => operation))
      .reduce((a, b) => a.concat(b), []);

    // Sums number of code samples per operation per callback
    const numSamples = operations.reduce(
      (sampleSum, operation) => sampleSum + operation.codeSamples.length,
      0,
    );

    const hasSamples = numSamples > 0;

    const dropdownOptions = operations.map((callback, idx) => {
      return {
        label: `${callback.httpVerb.toUpperCase()}: ${callback.name}`,
        value: idx.toString(),
      };
    });

    return (
      (hasSamples && (
        <div>
          <RightPanelHeader> Callback request samples </RightPanelHeader>

          <SamplesWrapper>
            <GenericDropdown
              items={operations}
              renderDropdown={this.renderDropdown}
              label={'Callback'}
              options={dropdownOptions}
            >
              {callback => (
                <CallbackReqSamples
                  key="callbackReqSamples"
                  callback={callback}
                  renderDropdown={this.renderDropdown}
                />
              )}
            </GenericDropdown>
          </SamplesWrapper>
        </div>
      )) ||
      null
    );
  }
}

export const SamplesWrapper = styled.div`
  background: ${({ theme }) => theme.codeBlock.backgroundColor};
  padding: ${props => props.theme.spacing.unit * 4}px;
`;
