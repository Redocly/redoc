import { Button } from '@redocly/theme/components/Button/Button';

import { styled } from '../../styled-components.js';

export const StyledButton = styled(Button)`
  & + & {
    margin-left: 0;
  }
`;
