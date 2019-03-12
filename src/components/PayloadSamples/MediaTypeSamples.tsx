import * as React from 'react';

import { SmallTabs, Tab, TabList, TabPanel } from '../../common-elements';
import { MediaTypeModel } from '../../services/models';

import { Example } from './Example';
import { NoSampleLabel } from './styled.elements';

export interface PayloadSamplesProps {
  mediaType: MediaTypeModel;
}

export class MediaTypeSamples extends React.Component<PayloadSamplesProps> {
  render() {
    const examples = this.props.mediaType.examples || {};
    const mimeType = this.props.mediaType.name;

    const noSample = <NoSampleLabel>No sample</NoSampleLabel>;

    const examplesNames = Object.keys(examples);
    if (examplesNames.length === 0) {
      return noSample;
    }
    if (examplesNames.length > 1) {
      return (
        <SmallTabs defaultIndex={0}>
          <TabList>
            {examplesNames.map(name => (
              <Tab key={name}> {examples[name].summary || name} </Tab>
            ))}
          </TabList>
          {examplesNames.map(name => (
            <TabPanel key={name}>
              <Example example={examples[name]} mimeType={mimeType} />
            </TabPanel>
          ))}
        </SmallTabs>
      );
    } else {
      const name = examplesNames[0];
      return (
        <div>
          <Example example={examples[name]} mimeType={mimeType} />
        </div>
      );
    }
  }
}
