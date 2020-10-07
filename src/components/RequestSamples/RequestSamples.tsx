import { observer } from 'mobx-react';
import * as React from 'react';
import {
  isPayloadSample,
  OperationModel,
  RedocNormalizedOptions,
  XPayloadSample,
} from '../../services';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

import {
  DropdownOption,
  RightPanelHeader,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '../../common-elements';
import { OptionsContext } from '../OptionsProvider';
import { SamplesDropdown, Flex } from './styled.elements';

export interface RequestSamplesProps {
  operation: OperationModel;
}

interface RequestSamplesState {
  codeSampleIdx: number;
  tabIndex: number;
}

@observer
export class RequestSamples extends React.Component<RequestSamplesProps, RequestSamplesState> {
  static contextType = OptionsContext;
  context: RedocNormalizedOptions;
  operation: OperationModel;

  state = {
    codeSampleIdx: 0,
    tabIndex: 0,
  };

  handleChangeLang = (option: DropdownOption, updatedTabIndex: number) => {
    this.setState({
      codeSampleIdx: option.idx,
    });
    if (this.state.tabIndex !== updatedTabIndex) {
      this.setState({
        tabIndex: updatedTabIndex,
      });
    }
  };

  handleChangeTab = (index: number) => {
    this.setState({
      tabIndex: index,
    });
  };

  render() {
    const { operation } = this.props;
    const samples = operation.codeSamples;

    const hasSamples = samples.length > 0;
    const hideTabList = samples.length === 1 ? this.context.hideSingleRequestSampleTab : false;

    const payloadSample = samples.find((sample) => isPayloadSample(sample));
    const codeSamples = samples.filter((sample) => !isPayloadSample(sample));
    const isCodeSamples = codeSamples.length > 0;
    const options = isCodeSamples
      ? codeSamples.map((codeSample, idx) => {
          return {
            idx,
            value: codeSample.label || codeSample.lang,
          };
        })
      : [];

    return (
      (hasSamples && (
        <div>
          <RightPanelHeader> Request samples </RightPanelHeader>
          <Tabs selectedIndex={this.state.tabIndex} onSelect={this.handleChangeTab}>
            <Flex>
              <TabList hidden={hideTabList}>
                {payloadSample && (
                  <Tab>
                    {payloadSample.label !== undefined ? payloadSample.label : payloadSample.lang}
                  </Tab>
                )}
                {isCodeSamples && <Tab>Code samples</Tab>}
              </TabList>
              {isCodeSamples && (
                <SamplesDropdown
                  value={options[this.state.codeSampleIdx].value}
                  onChange={(option: DropdownOption) =>
                    this.handleChangeLang(option, payloadSample ? 1 : 0)
                  }
                  options={options}
                />
              )}
            </Flex>
            {payloadSample && (
              <TabPanel>
                <div>
                  <PayloadSamples content={(payloadSample as XPayloadSample).requestBodyContent} />
                </div>
              </TabPanel>
            )}
            {isCodeSamples && (
              <TabPanel>
                <SourceCodeWithCopy
                  lang={codeSamples[this.state.codeSampleIdx].lang}
                  source={codeSamples[this.state.codeSampleIdx].source}
                />
              </TabPanel>
            )}
          </Tabs>
        </div>
      )) ||
      null
    );
  }
}
