import { observer } from 'mobx-react';
import * as React from 'react';
import { SendButton } from '../../common-elements/buttons';
import { ConsoleActionsRow } from '../../common-elements/panels';
import { OperationModel } from '../../services/models';
import { OpenAPISchema } from '../../types';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';
import { ConsoleEditor } from './ConsoleEditor';

const qs = require('qs');

export interface ConsoleViewerProps {
  operation: OperationModel;
}

export interface ConsoleViewerState {
  result: any;
}

export interface Schema {
  _$ref?: any;
  rawSchema?: OpenAPISchema;
}

@observer
export class ConsoleViewer extends React.Component<ConsoleViewerProps, ConsoleViewerState> {
  operation: OperationModel;
  visited = new Set();
  private consoleEditor: ConsoleEditor;

  constructor(props) {
    super(props);
    this.state = {
      result: null,
    };
  }
  onClickSend = async () => {
    const ace = this.consoleEditor && this.consoleEditor.editor;
    // const value = ace && ace.editor &&
    const schema = this.getSchema();
    const { operation } = this.props;

    // console.log('Schema: ' + JSON.stringify(schema, null, 2));
    let value = ace && ace.editor.getValue();

    const ref = schema && schema._$ref;

    // var valid = window && window.ajv.validate({ $ref: `specs.json${ref}` }, value);
    // console.log(JSON.stringify(window.ajv.errors));
    // if (!valid) {
    //  console.warn('INVALID REQUEST!');
    // }

    const endpoint = {
      method: operation.httpVerb,
      path: operation.servers[0].url + operation.path,
    };
    console.log('Value: ' + value);
    if (value) {
      value = JSON.parse(value);
    }

    const result = await this.invoke(endpoint, value);
    console.log('Result: ' + JSON.stringify(result));
    this.setState({
      result,
    });

  };

  async invoke(endpoint, body) {
    const headers = { 'Content-Type': 'application/json' };
    try {
      let url = endpoint.path;
      if (endpoint.method.toLocaleLowerCase() === 'get') {
        url = url + '?' + qs.stringify(body || '');
      }

      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      const request = new Request(url, {
        method: endpoint.method,
        credentials: 'include',
        redirect: 'manual',
        headers: myHeaders,
        body: (body) ? JSON.stringify(body) : undefined,
      });

      const result = await fetch(request);

      const contentType = result.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        // successful cross-domain connect/ability
        const resp = await result.json();

        return { json: resp, statusCode: result.status, _fetchRes: result };
      } else if (result.status === 200 && contentType && contentType.indexOf('text/plain') !== -1) {
        const resp = await result.text();
        return { resp, _fetchRes: result };
      } else {
        if (result && result.type && result.type === 'opaqueredirect') {
          return {
            json: {
              endpoint,
              error_code: 'RECEIVED_LOGIN_REDIRECT',
              details: 'Your session expired. Please refresh the page.',
              severity: 'error',
            },
          };
        }

        return {
          json: {
            endpoint,
            error_code: 'INVALID_SERVER_RESPONSE',
            details: 'Either server not authenticated or error on server',
            severity: 'error',
          },
        };
      }
    } catch (error) {
      console.error(error);
    }

  }

  render() {
    const { operation } = this.props;
    const requestBodyContent = operation.requestBody && operation.requestBody.content && operation.requestBody.content;
    const hasBodySample = requestBodyContent && requestBodyContent.hasSample;
    const samples = operation.codeSamples;
    const mediaTypes = (requestBodyContent && requestBodyContent.mediaTypes) ? requestBodyContent.mediaTypes : [];
    const { result } = this.state;
    return (
      <div>
        <h3> Console </h3>
        {hasBodySample && (
          <ConsoleEditor
            mediaTypes={mediaTypes}
            ref={(editor: ConsoleEditor) => (this.consoleEditor = editor)}
          />
        )}
        {false && samples.map(sample => (
          <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
        ))}
        <ConsoleActionsRow>
          <SendButton onClick={this.onClickSend} >Send Request</SendButton>
        </ConsoleActionsRow>
        {result &&
          <SourceCodeWithCopy lang="json" source={JSON.stringify(result, null, 2)} />
        }
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
    const schema: Schema = {
    };
    for (const mediaType of mediaTypes) {
      if (mediaType.name.indexOf('json') > -1) {
        if (mediaType.schema) {
          // schema = mediaType.schema;
          schema.rawSchema = mediaType.schema && mediaType.schema.rawSchema;
          console.log('rawSchema : ' + JSON.stringify(schema));
          console.log('schema : ' + JSON.stringify(mediaType.schema.schema));
          schema._$ref = mediaType.schema && mediaType.schema._$ref;
        }
        break;
      }
    }

    return schema;

  }
}
