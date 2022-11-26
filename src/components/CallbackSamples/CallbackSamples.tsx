import { observer } from 'mobx-react';
import * as React from 'react';

import styled from '../../styled-components';
import { RightPanelHeader } from '../../common-elements';
import { RedocNormalizedOptions } from '../../services';
import { CallbackModel } from '../../services/models';
import { OptionsContext } from '../OptionsProvider';
import { GenericChildrenSwitcher } from '../GenericChildrenSwitcher/GenericChildrenSwitcher';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { InvertedSimpleDropdown, MimeLabel } from '../PayloadSamples/styled.elements';
import { CallbackPayloadSample } from './CallbackReqSamples';

export interface CallbackSamplesProps {
  callbacks: CallbackModel[];
}

@observer
export class CallbackSamples extends React.Component<CallbackSamplesProps> {
  static contextType = OptionsContext;
  context: RedocNormalizedOptions;

  private renderDropdown = props => {
    return (
      <DropdownOrLabel
        Label={MimeLabel}
        Dropdown={InvertedSimpleDropdown}
        {...props}
        variant="dark"
      />
    );
  };

  render() {
    const { callbacks } = this.props;

    if (!callbacks || callbacks.length === 0) {
      return null;
    }

    const operations = callbacks
      .map(callback => callback.operations.map(operation => operation))
      .reduce((a, b) => a.concat(b), []);

    const hasSamples = operations.some(operation => operation.codeSamples.length > 0);

    if (!hasSamples) {
      return null;
    }

    const dropdownOptions = operations.map((callback, idx) => {
      return {
        value: `${callback.httpVerb.toUpperCase()}: ${callback.name}`,
        idx,
      };
    });

    return (
      <div>
        <RightPanelHeader> Callback payload samples </RightPanelHeader>

        <SamplesWrapper>
          <GenericChildrenSwitcher
            items={operations}
            renderDropdown={this.renderDropdown}
            label={'Callback'}
            options={dropdownOptions}
          >
            {callback => (
              <CallbackPayloadSample
                key="callbackPayloadSample"
                callback={callback}
                renderDropdown={this.renderDropdown}
              />
            )}
          </GenericChildrenSwitcher>
        </SamplesWrapper>
      </div>
    );
  }
}

export const SamplesWrapper = styled.div`
  background: ${({ theme }) => theme.codeBlock.backgroundColor};
  padding: ${props => props.theme.spacing.unit * 4}px;
`;
