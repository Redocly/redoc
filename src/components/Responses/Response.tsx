import * as React from 'react';
import { observer } from 'mobx-react';
import { RESPONSE_POSTFIX } from '../../constants';
import { getLocationHash } from '../../utils';

import type { ResponseModel, MediaTypeModel } from '../../services/models';
import { ResponseDetails } from './ResponseDetails';
import { ResponseDetailsWrap, StyledResponseTitle } from './styled.elements';

export interface ResponseViewProps {
  response: ResponseModel;
  operationHash?: string;
}

export const ResponseView = observer(
  ({ response, operationHash }: ResponseViewProps): React.ReactElement => {
    const { extensions, headers, type, summary, description, code, expanded, content } = response;

    const mimes = React.useMemo<MediaTypeModel[]>(
      () =>
        content === undefined ? [] : content.mediaTypes.filter(mime => mime.schema !== undefined),
      [content],
    );

    const empty = React.useMemo<boolean>(
      () =>
        (!extensions || Object.keys(extensions).length === 0) &&
        headers.length === 0 &&
        mimes.length === 0 &&
        !description,
      [extensions, headers, mimes, description],
    );

    const locationHash = getLocationHash();
    const responseOperationHash = `${operationHash}${RESPONSE_POSTFIX}`;
    const expandByDefault = locationHash.includes(responseOperationHash);
    const isExpanded = expanded === undefined ? expandByDefault : expanded;

    return (
      <div>
        <StyledResponseTitle
          onClick={() => response.setExpanded(!isExpanded)}
          type={type}
          empty={empty}
          title={summary || ''}
          code={code}
          opened={isExpanded}
        />
        {isExpanded && !empty && (
          <ResponseDetailsWrap>
            <ResponseDetails response={response} operationHash={responseOperationHash} />
          </ResponseDetailsWrap>
        )}
      </div>
    );
  },
);
