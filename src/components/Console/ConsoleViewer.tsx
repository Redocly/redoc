import { observer } from 'mobx-react';
import * as React from 'react';
import { OperationModel } from '../../services/models';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';
import { ConsoleEditor } from './ConsoleEditor';

export interface ConsoleViewerProps {
  operation: OperationModel;
}

@observer
export class ConsoleViewer extends React.Component<ConsoleViewerProps> {
  operation: OperationModel;
  visited = new Set();

  render() {
    const { operation } = this.props;
    const requestBodyContent = operation.requestBody && operation.requestBody.content && operation.requestBody.content;
    const hasBodySample = requestBodyContent && requestBodyContent.hasSample;
    const samples = operation.codeSamples;
    const mediaTypes = (requestBodyContent && requestBodyContent.mediaTypes) ? requestBodyContent.mediaTypes : [];

    return (
      <div>
        <h3> Console </h3>
        {hasBodySample && (
          <ConsoleEditor mediaTypes={mediaTypes} />
        )}
        {samples.map(sample => (
          <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
        ))}
      </div>
    );
  }
}
