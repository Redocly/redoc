import { memo, useCallback } from 'react';

import type { TFunction } from '@redocly/theme/core/openapi';
import type { ReactElement } from 'react';
import type { OperationModel } from '../../models/index.js';
import type { TabType } from '../../models/tab.js';

import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';

import { OperationResponseList } from '../Responses/index.js';
import { RequestDetails } from '../Request/RequestDetails.js';
import { LinkToField } from '../common/LinkToField.js';
import { makeDeepLink } from '../../services/index.js';
import { styled } from '../../styled-components.js';

export interface CallbackDetailsProps {
  operation: OperationModel;
  translate: TFunction;
}

function CallbackDetailsComponent({ operation, translate }: CallbackDetailsProps): ReactElement {
  const renderResponseTitle = useCallback(
    (tab: TabType) => (
      <Title>
        <LinkToField
          to={makeDeepLink(operation.id, `${operation.callbackId}/callback-response&c=${tab.key}`)}
        />
        {translate('openapi.callbackResponse', 'Callback Response')}
      </Title>
    ),
    [operation.callbackId, operation.id, translate],
  );
  return (
    <>
      <RequestDetails
        operation={operation}
        title={
          <>
            <LinkToField
              to={makeDeepLink(operation.id, `${operation.callbackId}/callback-request`)}
            />
            {translate('openapi.callbackRequest', 'Callback Request')}
          </>
        }
      />

      {operation.responses?.length ? (
        <OperationResponseList
          responses={operation.responses}
          operationId={operation.id}
          operationPointer={operation.pointer}
          callbackId={operation.callbackId}
          renderTitle={renderResponseTitle}
        />
      ) : null}
    </>
  );
}

export const CallbackDetails = memo<CallbackDetailsProps>(CallbackDetailsComponent);

const Title = styled.h4`
  position: relative;
  font-size: var(--font-size-lg);
  font-weight: var(--h4-font-weight);
  line-height: var(--h4-line-height);
  padding: 0;
  color: var(--h4-text-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 var(--spacing-sm) 0 0;

  :hover {
    ${LinkIcon} {
      opacity: 1;
      visibility: visible;
    }
  }
`;
