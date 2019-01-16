import { observer } from 'mobx-react';
import * as React from 'react';

import { ResponseModel } from '../../services/models';
import { ResponseDetails } from './ResponseDetails';
import { ResponseDetailsWrap } from './styled.elements';

@observer
export class ResponseView extends React.Component<{ response: ResponseModel }> {
  toggle = () => {
    this.props.response.toggle();
  };

  render() {
    const { headers, description, code, content } = this.props.response;
    const mimes =
      content === undefined ? [] : content.mediaTypes.filter(mime => mime.schema !== undefined);

    const empty = headers.length === 0 && mimes.length === 0 && !description;

    return (
      <div>
        {code === '200' && !empty && (
          <ResponseDetailsWrap>
            <ResponseDetails response={this.props.response} />
          </ResponseDetailsWrap>
        )}
      </div>
    );
  }
}
