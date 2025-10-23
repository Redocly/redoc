import type { PanelHeaderProps } from '@redocly/theme/components/Panel/PanelHeader';
import type { ReactElement } from 'react';
import type { OperationModel } from '../../models/index.js';

import { useTranslate } from '../../hooks/index.js';
import { CallbackPanel } from '../Panel/index.js';
import { CallbackDetails } from './CallbackDetails.js';
import { CallbackSummary } from './CallbackSummary.js';
import { pathIncludesLink } from '../../utils/index.js';
import { styled } from '../../styled-components.js';
import { useLocation } from '../../hooks/useLocation.js';

export interface CallbackOperationProps {
  operation: OperationModel;
  onExpand: (a: OperationModel | null) => void;
  selectedCallback: OperationModel | null;
}

export const CallbackOperation = ({
  operation,
  operation: { callbackId },
  onExpand,
  selectedCallback,
}: CallbackOperationProps): ReactElement => {
  const translate = useTranslate();
  const location = useLocation();
  const renderSummary = ({ expanded, toggle }: PanelHeaderProps) => {
    return (
      <CallbackSummary
        callback={operation}
        toggle={(params) => {
          toggle?.(params);
          onExpand?.(expanded ? null : operation);
        }}
        expanded={expanded}
        translate={translate}
      />
    );
  };

  return (
    <CallbackPanel
      header={renderSummary}
      expanded={
        selectedCallback?.callbackId === callbackId || pathIncludesLink(location, callbackId)
      }
      className="panel-response-callback"
    >
      <CallbackDetailsWrap>
        <CallbackDetails operation={operation} translate={translate} />
        <LeftBorder />
      </CallbackDetailsWrap>
    </CallbackPanel>
  );
};

const CallbackDetailsWrap = styled.div`
  position: relative;
  .property:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const LeftBorder = styled.div`
  position: absolute;
  height: calc(100% + 14px);
  border-left: 1px solid var(--border-color-primary);
  top: -14px;
  left: -12px;
  z-index: 0;
`;
