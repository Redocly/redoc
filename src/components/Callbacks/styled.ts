import { PanelHeaderTitle } from '@redocly/theme/components/Panel/PanelHeaderTitle';

import { styled } from '../../styled-components.js';

export const CallbackTitle = styled(PanelHeaderTitle)<{ deprecated?: boolean }>`
  text-decoration: ${({ deprecated }) => (deprecated ? 'line-through' : 'none')};
  margin: 0 4px;
  vertical-align: middle;
  color: var(--panel-response-callback-heading-text-color);
  font-weight: var(--font-weight-medium);
`;
