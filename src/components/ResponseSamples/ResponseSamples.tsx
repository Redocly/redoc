import * as React from 'react';
import { observer } from 'mobx-react';

import { MediaContentModel, OperationModel } from '../../services/models';

import { Tab, Tabs, TabList, TabPanel } from '../../common-elements';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';

export interface ResponseSampleProps {
  content: MediaContentModel;
}

class ResponseSample extends React.Component<ResponseSampleProps, any> {
  render() {
    return <PayloadSamples content={this.props.content} />;
  }
}

export interface ResponseSamplesProps {
  operation: OperationModel;
}

@observer
export class ResponseSamples extends React.Component<ResponseSamplesProps> {
  operation: OperationModel;

  visited = new Set();

  render() {
    const { operation } = this.props;
    let hasSuccessResponses = false;
    const responses = operation.responses.filter(response => {
      const code = response.code;
      if (parseInt(code) >= 100 && parseInt(code) <= 399) {
        hasSuccessResponses = true;
      }
      // filter only those with content
      return response.content && response.content.hasSample;
    });

    return (
      (responses.length > 0 && (
        <div>
          <h3> Response samples </h3>

          <Tabs defaultIndex={0}>
            <TabList>
              {responses.map(response => (
                <Tab className={'tab-' + response.type} key={response.code}>
                  {response.code}
                </Tab>
              ))}
            </TabList>
            {responses.map(response => (
              <TabPanel key={response.code}>
                <ResponseSample content={response.content!} />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      )) ||
      null
    );
  }
}
