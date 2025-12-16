import { useAtom } from 'jotai';

import type { ButtonProps } from '@redocly/theme/components/Button/Button';
import type { ComponentType } from 'react';

import { MaximizeIcon } from '@redocly/theme/icons/MaximizeIcon/MaximizeIcon';
import { Button } from '@redocly/theme/components/Button/Button';

import { operationStore } from '../../jotai/operation.js';
import { useTelemetry, useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

interface ExpandAllButtonProps {
  operationPointer: string;
  type: 'request' | 'response';
}

export const ExpandAllButton = ({
  operationPointer,
  type,
}: ExpandAllButtonProps) => {
  const translate = useTranslate();
  const [operationState, setOperationState] = useAtom(operationStore(operationPointer));
  const telemetry = useTelemetry();

  const handleToggle = () => {
    const expandedAll = !operationState[type].expandedAll;
    telemetry.sendExpandCollapseAllClickedMessage({ isExpanded: expandedAll });
    setOperationState({
      [type]: {
        expandedAll,
      },
    });

  };

  return (
    <StyledButton
      icon={<MaximizeIcon />}
      iconPosition="right"
      size="small"
      variant="ghost"
      onClick={handleToggle}
    >
      {operationState[type].expandedAll
        ? translate('openapi.collapseAll', 'Collapse all')
        : translate('openapi.expandAll', 'Expand all')}
    </StyledButton>
  );
};

const StyledButton: ComponentType<ButtonProps> = styled(Button)`
  margin-left: auto;
`;
