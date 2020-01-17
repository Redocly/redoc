import { observer } from 'mobx-react';
import * as React from 'react';

import { RightPanelHeader, Tab, TabList, TabPanel, Tabs } from '../../common-elements';
import { isPayloadSample, RedocNormalizedOptions } from '../../services';
import { CallbackModel } from '../../services/models';
import { Endpoint } from '../Endpoint/Endpoint';
import { OptionsContext } from '../OptionsProvider';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

export interface CallbackSamplesProps {
  callbacks: CallbackModel[];
}

@observer
export class CallbackSamples extends React.Component<CallbackSamplesProps> {
  static contextType = OptionsContext;
  context: RedocNormalizedOptions;

  render() {
    const { callbacks } = this.props;

    // Sums number of code samples per operation per callback
    const numSamples = callbacks.reduce(
      (callbackSum, callback) =>
        callbackSum +
        callback.operations.reduce(
          (sampleSum, operation) => sampleSum + operation.codeSamples.length,
          0,
        ),
      0,
    );

    const hasSamples = numSamples > 0;
    const hideTabList = numSamples === 1 ? this.context.hideSingleRequestSampleTab : false;

    const renderTabs = () => {
      return callbacks.map(callback => {
        return callback.operations.map(operation => {
          return operation.codeSamples.map(sample => {
            return (
              <Tab key={operation.id + '_' + operation.name}>
                {operation.name} {sample.label !== undefined ? sample.label : sample.lang}
              </Tab>
            );
          });
        });
      });
    };

    const renderTabPanels = () => {
      return callbacks.map(callback => {
        return callback.operations.map(operation => {
          return operation.codeSamples.map(sample => {
            return (
              <TabPanel key={sample.lang + '_' + (sample.label || '')}>
                {isPayloadSample(sample) ? (
                  <div>
                    <Endpoint operation={operation} inverted={false} />
                    <PayloadSamples content={sample.requestBodyContent} />
                  </div>
                ) : (
                  <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
                )}
              </TabPanel>
            );
          });
        });
      });
    };

    return (
      (hasSamples && (
        <div>
          <RightPanelHeader> Callback samples </RightPanelHeader>

          <Tabs defaultIndex={0}>
            <TabList hidden={hideTabList}>{renderTabs()}</TabList>
            {renderTabPanels()}
          </Tabs>
        </div>
      )) ||
      null
    );
  }
}
