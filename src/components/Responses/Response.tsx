import { observer } from 'mobx-react';
import * as React from 'react';

import { ResponseModel } from '../../services/models';

import { UnderlinedHeader } from '../../common-elements';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';
import { Schema } from '../Schema';

import { ResponseHeaders } from './ResponseHeaders';
import { ResponseDetailsWrap, StyledResponseTitle } from './styled.elements';

@observer
export class ResponseView extends React.Component<{ response: ResponseModel }> {
  toggle = () => {
    this.props.response.toggle();
  };

  render() {
    const { headers, type, description, code, expanded, content } = this.props.response;
    const mimes =
      content === undefined ? [] : content.mediaTypes.filter(mime => mime.schema !== undefined);

    const empty = headers.length === 0 && mimes.length === 0;

    return (
      <div>
        <StyledResponseTitle
          onClick={this.toggle}
          type={type}
          empty={empty}
          title={description || ''}
          code={code}
          opened={expanded}
        />
        {expanded &&
          !empty && (
            <ResponseDetailsWrap>
              <ResponseHeaders headers={headers} />
              <MediaTypesSwitch content={content} renderDropdown={this.renderDropdown}>
                {({ schema }) => {
                  return <Schema skipWriteOnly={true} key="schema" schema={schema} />;
                }}
              </MediaTypesSwitch>
            </ResponseDetailsWrap>
          )}
      </div>
    );
  }

  private renderDropdown = props => {
    return (
      <UnderlinedHeader key="header">
        Response Schema: <DropdownOrLabel {...props} />
      </UnderlinedHeader>
    );
  };
}
