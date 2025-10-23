import type { ReactElement } from 'react';
import type { OperationModel } from '../../models/index.js';

import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';

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
  return (
    <Dropdown
      className={className}
      active={false}
      trigger={
        <PathWrapper variant="ghost">
          <HttpVerb color={operation.httpVerb}>{operation.httpVerb}</HttpVerb>
          <Path>{operation.path}</Path>
        </PathWrapper>
      }
      withArrow={false}
    ></Dropdown>
  );
};
