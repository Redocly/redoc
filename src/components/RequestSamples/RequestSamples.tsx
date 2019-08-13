import { observer } from 'mobx-react';
import * as React from 'react';
import { OperationModel, RedocNormalizedOptions } from '../../services';
import { OpenAPIXCodeSample } from '../../types';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

import { RightPanelHeader, Tab, TabList, TabPanel, Tabs } from '../../common-elements';
import { OptionsContext } from '../OptionsProvider';

export interface RequestSamplesProps {
  operation: OperationModel;
}

export interface RequestSamplesState {
  codeSamples: OpenAPIXCodeSample[];
}

@observer
export class RequestSamples extends React.Component<RequestSamplesProps, RequestSamplesState> {
  static contextType = OptionsContext;
  context: RedocNormalizedOptions;
  operation: OperationModel;

  constructor(props) {
    super(props);
    const { operation } = this.props;
    const codeSamples = operation.codeSamples;
    this.state = {
      codeSamples,
    };
  }

  componentWillMount() {
    const { codeSamples } = this.state;
    codeSamples.forEach(codeSample => {
      if (codeSample.source && codeSample.source.startsWith('@url:')) {
        const fileURL = codeSample.source.substr(5);
        this.fetchOriginSample(fileURL)
        .then(source => {
          codeSample.source = source;
          this.setState({ codeSamples });
        });
      }
    });
  }

  fetchOriginSample = async fileURL => {
    try {
      const utf8Decoder = new TextDecoder('utf-8');
      const response = await fetch(fileURL,
        {
          headers: { 'Content-type': 'text/plain' },
        },
      );
      if (response && response.body) {
        const reader = response.body.getReader();
        const { value } = await reader.read();
        const source = value ? utf8Decoder.decode(value) : '';
        return source ? source : '';
      }
    } catch (e) {
      console.error(e.stack);
    }
    return '';
  }

  render() {
    const { operation } = this.props;
    const requestBodyContent = operation.requestBody && operation.requestBody.content;
    const hasBodySample = requestBodyContent && requestBodyContent.hasSample;
    const { codeSamples: samples } = this.state;

    const hasSamples = hasBodySample || samples.length > 0;
    const hideTabList =
      samples.length + (hasBodySample ? 1 : 0) === 1
        ? this.context.hideSingleRequestSampleTab
        : false;
    return (
      (hasSamples && (
        <div>
          <RightPanelHeader> Request samples </RightPanelHeader>

          <Tabs defaultIndex={0}>
            <TabList hidden={hideTabList}>
              {hasBodySample && <Tab key="payload"> Payload </Tab>}
              {samples.map(sample => (
                <Tab key={sample.lang + '_' + (sample.label || '')}>
                  {sample.label !== undefined ? sample.label : sample.lang}
                </Tab>
              ))}
            </TabList>
            {hasBodySample && (
              <TabPanel key="payload">
                <div>
                  <PayloadSamples content={requestBodyContent!} />
                </div>
              </TabPanel>
            )}
            {samples.map(sample => (
              <TabPanel key={sample.lang}>
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
