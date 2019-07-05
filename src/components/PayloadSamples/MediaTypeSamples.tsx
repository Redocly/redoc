import * as React from 'react';

import { DropdownProps } from '../../common-elements';
import { MediaTypeModel } from '../../services/models';

import { Example } from './Example';
import { Description, DropdownLabel, DropdownWrapper, NoSampleLabel } from './styled.elements';

export interface PayloadSamplesProps {
  mediaType: MediaTypeModel;
  renderDropdown: (props: DropdownProps) => JSX.Element;
}

interface MediaTypeSamplesState {
  activeIdx: number;
}

export class MediaTypeSamples extends React.Component<PayloadSamplesProps, MediaTypeSamplesState> {
  state = {
    activeIdx: 0,
  };
  switchMedia = ({ value }) => {
    this.setState({
      activeIdx: parseInt(value, 10),
    });
  };
  render() {
    const { activeIdx } = this.state;
    const examples = this.props.mediaType.examples || {};
    const mimeType = this.props.mediaType.name;

    const noSample = <NoSampleLabel>No sample</NoSampleLabel>;

    const examplesNames = Object.keys(examples);
    if (examplesNames.length === 0) {
      return noSample;
    }
    if (examplesNames.length > 1) {
      const options = examplesNames.map((name, idx) => {
        return {
          label: examples[name].summary || name,
          value: idx.toString(),
        };
      });
      return (
        <>
          <DropdownWrapper>
            <DropdownLabel>Example</DropdownLabel>
            {this.props.renderDropdown({
              value: options[activeIdx],
              options,
              onChange: this.switchMedia,
            })}
          </DropdownWrapper>
          {examplesNames.map(name => {
            const description = examples[name].description;
            const activeValue = options[activeIdx].label;

            return (
              (name === activeValue || examples[name].summary === activeValue) && (
                <div key={name}>
                  {description && <Description>{description}</Description>}
                  <Example example={examples[name]} mimeType={mimeType} />
                </div>
              )
            );
          })}
        </>
      );
    } else {
      const name = examplesNames[0];
      return (
        <div>
          {examples[name].description && <Description>{examples[name].description}</Description>}
          <Example example={examples[name]} mimeType={mimeType} />
        </div>
      );
    }
  }
}
