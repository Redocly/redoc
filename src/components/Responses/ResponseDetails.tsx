import { memo } from 'react';

import type { ReactElement } from 'react';
import type { ResponseProps } from './types.js';

import { ResponseHeaders } from './ResponseHeaders.js';
import { StyledDescription } from './styled.js';
import { BodyContent } from '../common/BodyContent/index.js';
import { makeDeepLink } from '../../services/index.js';

function ResponseDetailsComponent({
  response,
  operationId,
  callbackId,
  disableDeepLinks,
}: ResponseProps): ReactElement | null {
  const { description, headers, content, summary, code } = response;

  return (
    <>
      <StyledDescription className="redoc-markdown" source={summary} />
      <StyledDescription className="redoc-markdown" source={description} />
      <ResponseHeaders
        headers={headers}
        deepLink={
          disableDeepLinks ? undefined : generateDeepLink(operationId, callbackId, code, 'headers')
        }
      />
      <BodyContent
        content={content}
        skipWriteOnly={true}
        deepLink={
          disableDeepLinks ? undefined : generateDeepLink(operationId, callbackId, code, 'body')
        }
      />
    </>
  );
}

export const ResponseDetails = memo<ResponseProps>(ResponseDetailsComponent);

function generateDeepLink(
  operationId: string,
  callbackId: string = '',
  code: string,
  place: string,
): string {
  const suffix = callbackId
    ? `${callbackId}/response&c=${code}/${place}`
    : `response&c=${code}/${place}`;
  return makeDeepLink(operationId, suffix);
}
