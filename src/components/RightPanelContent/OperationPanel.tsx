import { observer } from 'mobx-react';
import * as React from 'react';
import { ResponseSamples } from '../../../src/components';
import { Endpoint } from '../../../src/components/Endpoint/Endpoint';
import { RequestSamples } from '../../../src/components/RequestSamples/RequestSamples';
import { RedocNormalizedOptions } from '../../../src/services';
import { Constants } from '../../../src/services/Constants';
import { OperationModel } from '../../../src/services/models';
import { ContentPanel } from './/ContentPanel';

interface RightPanelContentProps {
  operation: OperationModel;
  options: RedocNormalizedOptions;
}

@observer
export class OperationPanel extends React.Component<RightPanelContentProps> {
  render() {
    if (this.shouldShowOtherInfoPanel()) {
      return <ContentPanel content={this.props.operation.extensions[Constants.OTX_EXTENSION_KEY]}/>;
    } else {
      return (
        <>
          {!this.props.options.pathInMiddlePanel && <Endpoint operation={this.props.operation}/>}
          <RequestSamples operation={this.props.operation}/>
          <ResponseSamples operation={this.props.operation}/>
        </>
      );
    }
  }

  private shouldShowOtherInfoPanel() {
    return this.props.options.showExtensions &&
      this.props.operation.extensions[Constants.OTX_EXTENSION_KEY];
  }
}
