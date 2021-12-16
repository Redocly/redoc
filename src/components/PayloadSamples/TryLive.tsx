import { observer } from 'mobx-react';
import * as React from 'react';
import axios from 'axios';
import { MediaTypeSamples } from './MediaTypeSamples';

import { MediaContentModel, OperationModel } from '../..';
import { DropdownOrLabel, JsonViewer, MediaTypesSwitch } from '..';
import {
  DropdownLabel,
  InvertedSimpleDropdown,
  MimeLabel,
  ParamBox,
  ParamPrompt,
  ParamInput,
  ParamTable,
  TryUrl,
  TryBtn,
  TryTitle,
  TrySubtitle,
} from './styled.elements';
import { EmptyObject } from '../../types';

export interface TryLiveProps {
  content?: MediaContentModel | null;
  operation: OperationModel;
  selectedServerUrl: string;
}

export interface TryLiveState {
  url: { html: any[]; str: string };
  response: any;
  error: any;
  body: any;
  params: Record<string, string>;
}

@observer
export class Trylive extends React.Component<TryLiveProps, TryLiveState> {
  constructor(props: TryLiveProps) {
    super(props);

    const { selectedServerUrl, operation } = this.props;
    const initParams = this.getInitParams();

    this.state = {
      url: this.getParamString(selectedServerUrl + operation.path, initParams),
      response: null,
      error: null,
      body: null,
      params: initParams,
    };
  }

  getInitParams = () => {
    const { operation } = this.props;
    const path = operation.path;
    const paramRe = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/gi;
    let match;
    const params = {};
    while ((match = paramRe.exec(path)) !== null) {
      params[match[1]] = '';
    }
    return params;
  };

  getParamString = (str: string, params = {}) => {
    const regex1 = RegExp('{[a-zA-Z_][a-zA-Z0-9_]*}', 'gi');
    let count = 0;
    let lastIndex = 0;

    let outHtml: any[] = []; // url as html fragments
    let outStr = ''; // url as a string (used for making requests)

    let tmpStr = str;
    let tmpArr;
    while ((tmpArr = regex1.exec(tmpStr)) !== null) {
      const match = tmpArr[0];
      lastIndex = regex1.lastIndex;

      const preParamStr = tmpStr.substr(0, lastIndex - match.length);
      const paramValue = params[match.replace('{', '').replace('}', '')];

      outHtml = outHtml.concat([
        <React.Fragment key={count}>{preParamStr}</React.Fragment>,
        <span key={count + 1}>{paramValue || match}</span>,
      ]);
      outStr += preParamStr + paramValue;

      tmpStr = tmpStr.slice(lastIndex);
      count += 2;
    }
    if (tmpStr.length > 0) {
      if (count === 0) {
        outHtml = [<React.Fragment key={count}>{str}</React.Fragment>];
        outStr = str;
      } else {
        outHtml = outHtml.concat([<React.Fragment key={count}>{tmpStr}</React.Fragment>]);
        outStr += tmpStr;
      }
    }
    return {
      html: outHtml,
      str: outStr,
    };
  };

  onInputChange = e => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    this.setState(
      state => ({
        ...state,
        params: {
          ...state.params,
          [name]: value,
        },
      }),
      () => this.updateUrl(),
    );
  };

  updateUrl = () => {
    const { selectedServerUrl, operation } = this.props;
    this.setState(state => ({
      ...state,
      url: this.getParamString(selectedServerUrl + operation.path, this.state.params),
    }));
  };

  componentDidMount() {
    this.updateUrl();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.selectedServerUrl &&
      this.props.selectedServerUrl !== prevProps.selectedServerUrl
    ) {
      this.updateUrl();
    }
  }

  getTryLiveParams = () => {
    return this.props.operation.tryLiveParams;
  };

  getVerb = () => {
    return this.props.operation.httpVerb;
  };

  onTry = () => {
    this.setState(
      state => ({ ...state, response: null, error: null }),
      () => {
        this.doTry();
      },
    );
  };

  doTry = () => {
    const body = this.state.body || {};
    const apiAccessToken = this.getTryLiveParams().tryLiveAccessToken;

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    };
    if (apiAccessToken) {
      headers['Authorization'] = 'Bearer' + apiAccessToken;
    }

    const options: EmptyObject = {
      url: this.state.url.str,
      method: this.getVerb(),
      headers,
      data: body,
    };
    axios(options)
      .then(response => {
        this.setState({ response });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onContentChange = (_value: any) => {
    let value = {};
    if (typeof _value === 'string') {
      try {
        value = JSON.parse(_value.split('\\n').join('').trim());
      } catch (error) {}
    } else {
      value = _value;
    }
    this.setState({ body: value });
  };

  render() {
    const { content: mimeContent } = this.props;
    const { params, body, error, response, url } = this.state;

    return (
      <>
        <div style={{ position: 'relative' }}>
          <DropdownLabel>Request url</DropdownLabel>
          <TryUrl>
            <div>
              <span>{url.html}</span>
            </div>
            <TryBtn onClick={this.onTry}>
              <span>SEND</span>
            </TryBtn>
          </TryUrl>
        </div>
        {Object.keys(params).length > 0 && (
          <ParamBox>
            <DropdownLabel>Parameters</DropdownLabel>
            <ParamTable>
              <table>
                <tbody>
                  {Object.keys(params).map(key => {
                    return (
                      <tr key={key}>
                        <td>
                          <ParamPrompt>{key}</ParamPrompt>
                        </td>
                        <td>
                          <ParamInput>
                            <input
                              name={key}
                              value={params[key]}
                              onChange={this.onInputChange}
                              type="text"
                              spellCheck={false}
                            />
                          </ParamInput>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ParamTable>
          </ParamBox>
        )}
        {mimeContent && (
          <div style={{ marginTop: 16 }}>
            <MediaTypesSwitch
              content={mimeContent}
              renderDropdown={this.renderDropdown}
              withLabel={true}
            >
              {mediaType => (
                <MediaTypeSamples
                  key="samples"
                  mediaType={mediaType}
                  renderDropdown={this.renderDropdown}
                  editable={true}
                  value={body}
                  onContentChange={this.onContentChange}
                />
              )}
            </MediaTypesSwitch>
          </div>
        )}
        {response && (
          <div style={{ padding: 0 }}>
            <TryTitle>Response</TryTitle>
            Status: {response.status}
            {response.data && <JsonViewer data={response.data} />}
          </div>
        )}
        {error && (
          <div style={{ padding: 0 }}>
            <TryTitle>Error</TryTitle>
            {error.message && (
              <>
                <TrySubtitle>Message</TrySubtitle>
                <span style={{ color: '#e27a7a' }}>{error.message}</span>
              </>
            )}
            {error.response && (
              <>
                <TrySubtitle>Response</TrySubtitle>
                <JsonViewer data={error.response} />
              </>
            )}
          </div>
        )}
      </>
    );
  }

  private renderDropdown = props => {
    return <DropdownOrLabel Label={MimeLabel} Dropdown={InvertedSimpleDropdown} {...props} />;
  };
}
