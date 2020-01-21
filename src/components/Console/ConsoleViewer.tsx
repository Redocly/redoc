import { observer } from 'mobx-react';
import * as React from 'react';
import { SubmitButton } from '../../common-elements/buttons';
import { FlexLayoutReverse } from '../../common-elements/panels';
import { FieldModel, OperationModel } from '../../services/models';
import { OpenAPISchema } from '../../types';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';
import { ConsoleEditor } from './ConsoleEditor';

const qs = require('qs');

export interface ConsoleViewerProps {
  operation: OperationModel;
  additionalHeaders?: object;
  queryParamPrefix?: string;
  queryParamSuffix?: string;
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
  additionalHeaders: object;
  visited = new Set();
  private consoleEditor: any;

  constructor(props) {
    super(props);
    this.state = {
      result: null,
    };
  }
  onClickSend = async () => {
    const ace = this.consoleEditor && this.consoleEditor.editor;
    const { operation, additionalHeaders = {} } = this.props;
    let value = ace && ace.editor.getValue();

    const content = operation.requestBody && operation.requestBody.content;
    const mediaType = content && content.mediaTypes[content.activeMimeIdx];
    const endpoint = {
      method: operation.httpVerb,
      path: operation.servers[0].url + operation.path,
    };
    if (value) {
      value = JSON.parse(value);
    }
    const contentType = mediaType && mediaType.name || 'application/json';
    const contentTypeHeader = { 'Content-Type': contentType };
    const headers = { ...additionalHeaders, ...contentTypeHeader };
    let result;
    try {
      result = await this.invoke(endpoint, value, headers);
      this.setState({
        result,
      });
    } catch (error) {
      this.setState({
        result: error,
      });
    }
  };

  /*
  * If we have a url like foo/bar/{uuid} uuid will be replaced with what user has typed in.
  */
  addParamsToUrl(url: string, params: FieldModel[]) {
    const queryParamPrefix = '{';
    const queryParamSuffix = '}';

    for (const fieldModel of params) {
      console.log(fieldModel.name + ' ' + url);
      console.log(fieldModel.$value);
      if (url.indexOf(`${queryParamPrefix}${fieldModel.name}${queryParamSuffix}`) > -1 && fieldModel.$value.length > 0) {
        url = url.replace(`${queryParamPrefix}${fieldModel.name}${queryParamSuffix}`, fieldModel.$value);
      }
    }

    if (url.split(queryParamPrefix).length > 1) {
      console.error('** we have missing query params ** ', url);
      throw Error(`** we have missing query params ** ${url}`);
    }

    return url;

  }

  async invoke(endpoint, body, headers = {}) {
    try {
      const { operation } = this.props;
      let url = this.addParamsToUrl(endpoint.path, operation.parameters || []);
      if (endpoint.method.toLocaleLowerCase() === 'get') {
        url = url + '?' + qs.stringify(body || '');
      }
      const myHeaders = new Headers();
      for (const [key, value] of Object.entries(headers)) {
        myHeaders.append(key, `${value}`);
      }

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
    const mediaTypes = (requestBodyContent && requestBodyContent.mediaTypes) ? requestBodyContent.mediaTypes : [];
    const { result } = this.state;
    return (
      <div>
        <h3> Request </h3>
        {hasBodySample && (
          <ConsoleEditor
            mediaTypes={mediaTypes}
            ref={(editor: any) => (this.consoleEditor = editor)}
          />
        )}
        <FlexLayoutReverse>
          <SubmitButton onClick={this.onClickSend} >Send Request</SubmitButton>
        </FlexLayoutReverse>
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
          schema.rawSchema = mediaType.schema && mediaType.schema.rawSchema;
          console.log('rawSchema : ' + JSON.stringify(schema));
          console.log('schema : ' + JSON.stringify(mediaType.schema.schema));
        }
        break;
      }
    }

    return schema;

  }
}
