import { memo, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { RequestProps } from './types.js';

import { Row } from '../common/index.js';
import { Title } from '../common/OperationItemTitle.js';
import { LinkToField } from '../common/LinkToField.js';
import { makeDeepLink } from '../../services/index.js';
import { Description } from '../OperationItem/Description.js';
import { Security } from '../Security/index.js';
import { hasNestedFields } from '../../utils/index.js';
import { ExpandAllButton } from '../ExpandAllButton/index.js';
import { RequestParameters } from '../RequestParameters/index.js';
import { activeMimeNameAtom } from '../../jotai/app.js';
import { getActiveMediaType } from '../../models/mediaContent.js';
import { styled } from '../../styled-components.js';
import { Extensions } from '../common/Extensions.js';

function RequestDetailsComponent({
  operation: {
    id,
    description,
    externalDocs,
    parameters,
    requestBody,
    pointer,
    security,
    extensions,
    callbackId,
  },
  title,
  translate,
}: RequestProps) {
  const activeMimeName = useAtomValue(activeMimeNameAtom);

  const showExpandAllButton = useMemo(() => {
    const hasNestedParameters = parameters.some(
      ({ schema }) => !schema.isPrimitive && !schema.isCircular,
    );
    if (!requestBody?.content || hasNestedParameters) {
      return hasNestedParameters;
    }

    const { schema } = getActiveMediaType(requestBody.content, activeMimeName) || {};

    return hasNestedFields(schema);
  }, [activeMimeName, parameters, requestBody?.content]);

  const hasCustomExtensions = Object.keys(extensions || {}).length > 0;

  return (
    <>
      <Row>
        <HeadingWrapper>
          <Title>
            {id && <LinkToField to={makeDeepLink(id, 'request')} />}
            {title || translate?.('openapi.request', 'Request')}
            {showExpandAllButton && (
              <ExpandAllButton
                operationPointer={pointer}
                type="request"
              />
            )}
          </Title>
          <Description
            description={description || externalDocs ? description : undefined}
            externalDocs={externalDocs}
          />
          {hasCustomExtensions && <Extensions extensions={extensions} />}
          <Security securities={security} />
        </HeadingWrapper>
      </Row>
      <RequestParameters
        parameters={parameters}
        body={requestBody}
        operationId={id}
        callbackId={callbackId}
      />
    </>
  );
}

const HeadingWrapper = styled.div`
  width: 100%;
`;

export const RequestDetails = memo<RequestProps>(RequestDetailsComponent);
