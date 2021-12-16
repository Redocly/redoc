import { observer } from 'mobx-react';
import * as React from 'react';
import {
  isPayloadSample,
  isTrySample,
  OperationModel,
  RedocNormalizedOptions,
  AppStore,
} from '../../services';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { Trylive } from '../PayloadSamples/TryLive';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

import { RightPanelHeader, Tab, TabList, TabPanel, Tabs } from '../../common-elements';
import { OptionsContext } from '../OptionsProvider';
import { l } from '../../services/Labels';

export interface RequestSamplesProps {
  operation: OperationModel;
  store?: AppStore;
}

@observer
export class RequestSamples extends React.Component<RequestSamplesProps> {
  static contextType = OptionsContext;
  context: RedocNormalizedOptions;
  operation: OperationModel;

  render() {
    const { operation, store } = this.props;
    const samples = operation.codeSamples;

    const hasSamples = samples.length > 0;
    const hideTabList = samples.length === 1 ? this.context.hideSingleRequestSampleTab : false;
    const selectedServerUrl = store?.spec.selectedServerUrl || '';

    return hasSamples ? (
      <div>
        <RightPanelHeader> {l('requestSamples')} </RightPanelHeader>

        <Tabs defaultIndex={0}>
          <TabList hidden={hideTabList}>
            {samples.map(sample => (
              <Tab key={sample.lang + '_' + (sample.label || '')}>
                {sample.label !== undefined ? sample.label : sample.lang}
              </Tab>
            ))}
          </TabList>
          {samples.map(sample => (
            <TabPanel key={sample.lang + '_' + (sample.label || '')}>
              {isPayloadSample(sample) ? (
                <div>
                  <PayloadSamples content={sample.requestBodyContent} />
                </div>
              ) : isTrySample(sample) ? (
                <div>
                  <Trylive
                    content={sample.requestBodyContent}
                    operation={operation}
                    selectedServerUrl={selectedServerUrl}
                  />
                </div>
              ) : (
                <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
              )}
            </TabPanel>
          ))}
        </Tabs>
      </div>
    ) : (
      <div>
        <Tabs defaultIndex={0}>
          <TabList hidden={false}>
            <Tab key="try">Try</Tab>
          </TabList>
          <TabPanel>
            <div>
              <Trylive content={null} operation={operation} selectedServerUrl={selectedServerUrl} />
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
