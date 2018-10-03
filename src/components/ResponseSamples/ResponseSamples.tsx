import { observer } from 'mobx-react';
import * as React from 'react';

import { OperationModel } from '../../services/models';

import { RightPanelHeader, Tab, TabList, TabPanel, Tabs } from '../../common-elements';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

export interface ResponseSamplesProps {
  operation: OperationModel;
}

@observer
export class ResponseSamples extends React.Component<ResponseSamplesProps> {
  operation: OperationModel;

  render() {
    const { operation } = this.props;
    const samples = operation.responseSamples;

    const responses = operation.responses.filter(response => {
      return response.content && response.content.hasSample;
    });

    return (
      (responses.length > 0 && (
        <div>
          <RightPanelHeader> Response samples </RightPanelHeader>

          <Tabs defaultIndex={0}>
            <TabList>
              {responses.map(response => (
                <Tab className={'tab-' + response.type} key={response.code}>
                  {response.code}
                </Tab>
              ))}
              {samples.map(sample => (
                <Tab key={`response-${sample.label || sample.lang}`}>
                  {sample.label || sample.lang}
                </Tab>
              ))}
            </TabList>
            {responses.map(response => (
              <TabPanel key={response.code}>
                <div>
                  <PayloadSamples content={response.content!} />
                </div>
              </TabPanel>
            ))}
            {samples.map(sample => (
              <TabPanel key={`response-${sample.label || sample.lang}`}>
                <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      )) ||
      null
    );
  }
}
