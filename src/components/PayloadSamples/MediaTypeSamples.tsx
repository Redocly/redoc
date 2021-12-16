import * as React from 'react';

import styled from '../../styled-components';

import { DropdownProps } from '../../common-elements';
import { ExampleModel, MediaTypeModel } from '../../services/models';
import { Markdown } from '../Markdown/Markdown';
import { Example } from './Example';
import { DropdownLabel, DropdownWrapper, NoSampleLabel } from './styled.elements';

export interface PayloadSamplesProps {
  mediaType: MediaTypeModel;
  renderDropdown: (props: DropdownProps) => JSX.Element;
  editable?: boolean;
  value?: any;
  onContentChange?: (value: any) => void;
}

interface MediaTypeSamplesState {
  activeIdx: number;
}

export class MediaTypeSamples extends React.Component<PayloadSamplesProps, MediaTypeSamplesState> {
  constructor(props: PayloadSamplesProps) {
    super(props);

    this.state = {
      activeIdx: 0,
    };

    if (this.props.editable && this.props.onContentChange) {
      this.props.onContentChange(this.getExample().value);
    }
  }

  switchMedia = ({ idx }) => {
    this.setState({
      activeIdx: idx,
    });
  };

  getExample = () => {
    const examples = this.props.mediaType.examples || {};
    const examplesNames = Object.keys(examples);
    return examples[examplesNames[this.state.activeIdx]];
  };

  render() {
    const { editable = false, value, onContentChange } = this.props;
    const { activeIdx } = this.state;
    const examples = this.props.mediaType.examples || {};
    const mimeType = this.props.mediaType.name;

    const noSample = <NoSampleLabel>No sample</NoSampleLabel>;

    const examplesNames = Object.keys(examples);
    if (examplesNames.length === 0) {
      return noSample;
    }

    if (!editable && examplesNames.length > 1) {
      const options = examplesNames.map((name, idx) => {
        return {
          value: examples[name].summary || name,
          idx,
        };
      });

      const example = examples[examplesNames[activeIdx]];
      const description = example.description;

      return (
        <SamplesWrapper>
          <DropdownWrapper>
            <DropdownLabel>Example</DropdownLabel>
            {this.props.renderDropdown({
              value: options[activeIdx].value,
              options,
              onChange: this.switchMedia,
              ariaLabel: 'Example',
            })}
          </DropdownWrapper>
          <div>
            {description && <Markdown source={description} />}
            {this.getExampleComponent(example, mimeType, editable, value, onContentChange)}
          </div>
        </SamplesWrapper>
      );
    } else {
      const example = examples[examplesNames[0]];
      return editable ? (
        <SamplesWrapper>
          <DropdownLabel>Request body</DropdownLabel>
          <div
            style={{
              backgroundColor: 'rgba(38, 50, 56, 0.4)',
              borderColor: 'rgba(38, 50, 56, 0.5)',
            }}
          >
            <div style={{ height: 8 }}></div>
            {this.getExampleComponent(example, mimeType, editable, value, onContentChange)}
          </div>
        </SamplesWrapper>
      ) : (
        <SamplesWrapper>
          {example.description && <Markdown source={example.description} />}
          {this.getExampleComponent(example, mimeType, editable, value, onContentChange)}
        </SamplesWrapper>
      );
    }
  }

  getExampleComponent = (
    example: ExampleModel,
    mimeType: string,
    editable: boolean,
    value: any,
    onContentChange,
  ) => {
    return (
      <Example
        example={example}
        mimeType={mimeType}
        editable={editable}
        value={value}
        onChange={onContentChange}
      />
    );
  };
}

const SamplesWrapper = styled.div`
  margin-top: 15px;
`;
