import { observer } from 'mobx-react';
import * as React from 'react';
import { OperationModel } from '../../services/models';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';
import { SendButton } from '../../common-elements/buttons';
import { ConsoleActionsRow } from '../../common-elements/panels';
import { ConsoleEditor } from './ConsoleEditor';

export interface ConsoleViewerProps {
  operation: OperationModel;
}

@observer
export class ConsoleViewer extends React.Component<ConsoleViewerProps> {
  private consoleEditor: ConsoleEditor;
  operation: OperationModel;
  visited = new Set();

  onClickSend = () => {
    const ace = this.consoleEditor && this.consoleEditor.editor;
    //const value = ace && ace.editor &&
    const schema = this.getSchema();

    //console.log('Schema: ' + JSON.stringify(schema, null, 2));
    const value = ace && ace.editor.getValue();

    const ref = schema && schema['_$ref'];

    var valid = window && window.ajv.validate({ $ref: `specs.json${ref}` }, value);

    console.log(JSON.stringify(window.ajv.errors));

    if (!valid) {
      console.warn('INVALID REQUEST!');
    }


    console.log('Value: ' + value);
  };

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
          <ConsoleEditor
            mediaTypes={mediaTypes}
            ref={(editor: ConsoleEditor) => (this.consoleEditor = editor)} />
        )}
        {false && samples.map(sample => (
          <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
        ))}
        <ConsoleActionsRow>
          <SendButton onClick={this.onClickSend} >Send Request</SendButton>
        </ConsoleActionsRow>
      </div>
    );
  }

  getSchema() {
    const { operation } = this.props;
    const requestBodyContent = operation.requestBody && operation.requestBody.content && operation.requestBody.content;
    const mediaTypes = (requestBodyContent && requestBodyContent.mediaTypes) ? requestBodyContent.mediaTypes : [];

    if (!mediaTypes.length) {
      return null;
    }
    let schema = {};
    for (let mediaType of mediaTypes) {
      if (mediaType.name.indexOf('json') > -1) {
        if (mediaType.schema) {
          //schema = mediaType.schema;
          schema = mediaType.schema && mediaType.schema.rawSchema;
          console.log('rawSchema : ' + JSON.stringify(schema));
          console.log('schema : ' + JSON.stringify(mediaType.schema.schema));
          schema['_$ref'] = mediaType.schema && mediaType.schema['_$ref']
        }
        break;
      }
    }

    return schema;

  }
}
