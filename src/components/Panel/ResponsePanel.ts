import { Panel } from '@redocly/theme/components/Panel/Panel';

import { FieldsGroupHeader } from '../common/headers.js';
import { Trigger } from './Trigger.js';
import { styled } from '../../styled-components.js';

export const StyledResponsePanel = styled(Panel)`
  ${FieldsGroupHeader} {
    &:first-child {
      margin-top: 0;
    }
  }

  ${Trigger} {
    flex: 1;
    max-width: 100%;
    justify-content: space-between;
  }
`;

export const CallbackPanel = styled(StyledResponsePanel)`
  border-bottom: 1px solid var(--border-color-primary);
  &:not(:last-child) {
    margin-bottom: 0;
    border-radius: 0;
  }

  ${Trigger} {
    max-width: calc(100% - 9px - var(--spacing-unit)); /* shelf icon size and small padding */
    justify-content: flex-start;
  }
`;
