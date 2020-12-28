import { observer } from 'mobx-react';
import * as React from 'react';
import { isPayloadSample, OperationModel, RedocNormalizedOptions } from '../../services';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

import { RightPanelHeader, Tab, TabList, TabPanel, Tabs } from '../../common-elements';
import { OptionsContext } from '../OptionsProvider';

export interface RequestSamplesProps {
  operation: OperationModel;
}

@observer
export class RequestSamples extends React.Component<RequestSamplesProps> {
  static contextType = OptionsContext;
  context: RedocNormalizedOptions;
  operation: OperationModel;

  render() {
    const { operation } = this.props;
    const samples = operation.codeSamples;

    const hasSamples = samples.length > 0;
    const hideTabList = samples.length === 1 ? this.context.hideSingleRequestSampleTab : false;
    return (
      (hasSamples && (
        <div>
          <RightPanelHeader> Request samples </RightPanelHeader>

          <Tabs defaultIndex={0}>
            <TabList hidden={hideTabList}>
              {samples.map(sample => (
                <Tab className="exampleButton" key={sample.lang + '_' + (sample.label || '')}>
                  {sample.label !== undefined ? sample.label : 
                  sample.lang === 'Shell + curl' ? sample.lang.slice(8) : 
                  sample.lang === 'Node + native' ? sample.lang.slice(0, 4) :
                  sample.lang === 'Go + native' ? sample.lang.slice(0, 2) :
                  sample.lang === 'Ruby + native' ? sample.lang.slice(0, 4) : 
                  sample.lang === 'Python + python3' ? sample.lang.slice(9) : 
                  sample.lang === 'Javascript + jquery' ? sample.lang.slice(0, 10) : sample.lang}
                </Tab>
              ))}
            </TabList>
            {samples.map(sample => (
              <TabPanel key={sample.lang + '_' + (sample.label || '')}>
                {isPayloadSample(sample) ? (
                  <div>
                    <PayloadSamples content={sample.requestBodyContent} />
                  </div>
                ) : (
                  <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
                )}
              </TabPanel>
            ))}
          </Tabs>
        </div>
      )) ||
      null
    );
  }
}
