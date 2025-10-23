import { memo } from 'react';

import type { TFunction } from '@redocly/theme/core/openapi';
import type { ReactElement } from 'react';
import type { OperationModel } from '../../models';

import { PanelHeader } from '@redocly/theme/components/Panel/PanelHeader';

import { PayloadSamples } from '../PayloadSamples/index.js';
import { ServerListDropdown } from '../ServerListDropdown/index.js';
import { CodeBlockPanel } from '../common/index.js';
import { styled } from '../../styled-components.js';

export interface CallbackSamplesProps {
  callback: OperationModel;
  translate: TFunction;
}

function CallbackSamplesComponent({
  callback,
  translate,
}: CallbackSamplesProps): ReactElement | null {
  const hasSamples = callback?.hasSamples;

  if (!hasSamples) {
    return null;
  }

  const renderSummary = () => {
    return (
      <StyledPanelHeader isExpandable={false}>
        <StyledServerListDropdown operation={callback} />
        <PayloadTitle>{translate('openapi.payload', 'Payload')}</PayloadTitle>
      </StyledPanelHeader>
    );
  };

  return (
    <CodeBlockPanel className="panel-callback-samples" header={renderSummary} isExpandable={false}>
      {callback?.payload?.requestBodyContent && (
        <PayloadSamples content={callback.payload.requestBodyContent} />
      )}
    </CodeBlockPanel>
  );
}

export const CallbackSamples = memo<CallbackSamplesProps>(CallbackSamplesComponent);

const PayloadTitle = styled.div`
  font-size: var(--font-size-sm);
  font-style: normal;
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-sm);
  padding: 0 var(--spacing-xs);
  border-radius: var(--border-radius);
  background: var(--dropdown-bg-color);
  color: var(--dropdown-text-color);
`;

const StyledPanelHeader = styled(PanelHeader)`
  flex-wrap: nowrap;
`;

const StyledServerListDropdown = styled(ServerListDropdown)<{ titleWidth?: number }>`
  padding-right: var(--spacing-base);
  min-width: 0;
`;
