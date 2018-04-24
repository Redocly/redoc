import { observer } from 'mobx-react';
import * as React from 'react';
import qs = require('qs');
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

  onClickSend = async () => {
    const ace = this.consoleEditor && this.consoleEditor.editor;
    //const value = ace && ace.editor &&
    const schema = this.getSchema();
    const { operation } = this.props;

    //console.log('Schema: ' + JSON.stringify(schema, null, 2));
    const value = ace && ace.editor.getValue();

    const ref = schema && schema['_$ref'];

    var valid = window && window.ajv.validate({ $ref: `specs.json${ref}` }, value);
    console.log(JSON.stringify(window.ajv.errors));
    if (!valid) {
      console.warn('INVALID REQUEST!');
    }

    const endpoint = {
      method: operation.httpVerb,
      path: operation.servers[0].url + operation.path
    }

    console.log('Value: ' + value);
    const result = await this.invoke(endpoint, { 'Content-Type': 'application/*' }, JSON.parse(value));
    console.log('Result: ' + JSON.stringify(result));

  };

  async invoke(endpoint, headers, body) {

    const fetchArgs = {
      method: endpoint.method,
      headers,
      redirect: 'manual',
      credentials: 'include'
    }

    let url = endpoint.path;
    if (endpoint.method.toLocaleLowerCase() === 'get') {
      url = url + '?' + qs.stringify(body);
    } else {
      fetchArgs['body'] = (body) ? JSON.stringify(body) : null;
    }

    const result = await fetch(url, fetchArgs);

    const contentType = result.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      // successful cross-domain connect/ability
      const resp = await result.json();

      return { json: resp, statusCode: result.status, _fetchRes: result };
    }
    else if (result.status === 200 && contentType && contentType.indexOf("text/plain") !== -1) {
      const resp = await result.text();
      return { resp, _fetchRes: result };
    }
    else {
      if (result && result.type && result.type === 'opaqueredirect') {
        return {
          json: {
            endpoint,
            error_code: "RECEIVED_LOGIN_REDIRECT",
            details: "Your session expired. Please refresh the page.",
            severity: "error"
          }
        }
      }

      return {
        json: {
          endpoint,
          error_code: "INVALID_SERVER_RESPONSE",
          details: "Either server not authenticated or error on server",
          severity: "error"
        }
      };
    }
  }


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
