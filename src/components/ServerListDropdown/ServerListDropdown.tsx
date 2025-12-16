import type { ReactElement } from 'react';
import type { OperationModel } from '../../models/index.js';

import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';
import { getOperationColor } from '@redocly/theme/core/openapi';

import { HttpVerb } from '../common/index.js';
import { PathWrapper, Path } from './styled.js';

export interface ServerListDropdownProps {
  operation: OperationModel;
  className?: string;
}

export const ServerListDropdown = ({
  operation,
  className,
}: ServerListDropdownProps): ReactElement => {
  const httpColor = getOperationColor({
    isAdditionalOperation: operation.isAdditionalOperation,
    httpVerb: operation.httpVerb,
  });

  return (
    <Dropdown
      className={className}
      active={false}
      trigger={
        <PathWrapper variant="ghost">
          <HttpVerb color={httpColor}>{operation.httpVerb}</HttpVerb>
          <Path>{operation.path}</Path>
        </PathWrapper>
      }
      withArrow={false}
    ></Dropdown>
  );
};
