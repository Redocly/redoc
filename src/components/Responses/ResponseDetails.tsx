import * as React from 'react';

import { ResponseModel, ReverseEventsRWOProps } from '../../services/models';

import { UnderlinedHeader } from '../../common-elements';
import { DropdownOrLabel } from '../DropdownOrLabel/DropdownOrLabel';
import { MediaTypesSwitch } from '../MediaTypeSwitch/MediaTypesSwitch';
import { Schema } from '../Schema';

import { Markdown } from '../Markdown/Markdown';
import { ResponseHeaders } from './ResponseHeaders';

export interface ResponseDetailsProps {
  response: ResponseModel;
  reverseEventsReadWriteOnly?: ReverseEventsRWOProps;
}

export class ResponseDetails extends React.PureComponent<ResponseDetailsProps> {
  render() {
    const { reverseEventsReadWriteOnly = {}, response: { description, headers, content } } = this.props;
    const skipWriteOnly = !reverseEventsReadWriteOnly.reverseEventsWriteOnlyProps;
    return (
      <>
        {description && <Markdown source={description} />}
        <ResponseHeaders headers={headers} />
        <MediaTypesSwitch content={content} renderDropdown={this.renderDropdown}>
          {({ schema }) => {
            return <Schema skipWriteOnly={skipWriteOnly} key="schema" schema={schema} />;
          }}
        </MediaTypesSwitch>
      </>
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
