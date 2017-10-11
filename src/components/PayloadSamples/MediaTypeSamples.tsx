import * as React from 'react';

import { MediaTypeModel } from '../../services/models';
import { StyledJson } from '../JsonViewer/JsonViewer';
import { SourceCode } from '../SourceCode/SourceCode';
import { SmallTabs, TabList, TabPanel, Tab } from '../../common-elements';
import { NoSampleLabel } from './styled.elements';

import { isJsonLike, langFromMime } from '../../utils';

export interface PayloadSamplesProps {
  mediaType: MediaTypeModel;
}

export class MediaTypeSamples extends React.Component<PayloadSamplesProps> {
  render() {
    const examples = this.props.mediaType.examples || {};
    const mimeType = this.props.mediaType.name;

    const noSample = <NoSampleLabel>No sample</NoSampleLabel>;
    const sampleView = isJsonLike(mimeType)
      ? sample => <StyledJson data={sample} />
      : sample =>
          (sample && <SourceCode lang={langFromMime(mimeType)} source={sample} />) || { noSample };

    const examplesNames = Object.keys(examples);
    if (examplesNames.length === 0) return noSample;
    if (examplesNames.length > 1) {
      return (
        <SmallTabs>
          <TabList>
            {examplesNames.map(name => <Tab key={name}> {examples[name].summary || name} </Tab>)}
          </TabList>
          {examplesNames.map(name => (
            <TabPanel key={name}>{sampleView(examples[name].value)}</TabPanel>
          ))}
        </SmallTabs>
      );
    } else {
      const name = examplesNames[0];
      return <div>{sampleView(examples[name].value)}</div>;
    }
  }
}
