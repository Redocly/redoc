import { Panel } from '@redocly/theme/components/Panel/Panel';
import { PanelBody } from '@redocly/theme/components/Panel/PanelBody';

import { styled } from '../../styled-components.js';

export const CodeBlockPanel = styled(Panel)`
  ${PanelBody} {
    padding: var(--spacing-sm) 0 0;
  }
`;
