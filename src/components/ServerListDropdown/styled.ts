import { breakpoints } from '@redocly/theme/core/openapi';
import { Button } from '@redocly/theme/components/Button/Button';
import { CopyButton } from '@redocly/theme/components/Buttons/CopyButton';
import { DropdownMenuItem } from '@redocly/theme/components/Dropdown/DropdownMenuItem';

import { styled } from '../../styled-components.js';

export const PathWrapper = styled(Button)`
  display: inline-flex;
  overflow-x: hidden;
  font-weight: var(--font-weight-regular);
`;

export const Path = styled.span`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  line-height: var(--line-height-base);
  font-size: var(--font-size-base);
`;

export const StyledDropdownMenuItem = styled(DropdownMenuItem)`
  padding: calc(var(--spacing-unit) * 1.5) var(--spacing-xs) calc(var(--spacing-unit) * 1.5)
    var(--spacing-lg);
  @media screen and (max-width: ${breakpoints.large}) {
    max-width: 280px;
  }
`;

export const StyledCopyButton = styled(CopyButton)`
  :hover {
    background-color: var(--dropdown-menu-item-bg-color-hover);
  }
`;
