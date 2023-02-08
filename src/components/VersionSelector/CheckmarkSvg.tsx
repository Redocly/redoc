import * as React from 'react';
import { palette } from '@leafygreen-ui/palette';
import styled from '../../styled-components';

const StyledSvg = styled.svg`
  color: ${palette.blue.base};
  flex-shrink: 0;
  margin-right: 6px;
`;

const Checkmark = () => {
  return (
    <StyledSvg height={16} width={16} role="img" aria-label="Checkmark Icon" viewBox="0 0 16 16">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.30583 9.05037L11.7611 3.59509C12.1516 3.20457 12.7848 3.20457 13.1753 3.59509L13.8824 4.3022C14.273 4.69273 14.273 5.32589 13.8824 5.71642L6.81525 12.7836C6.38819 13.2106 5.68292 13.1646 5.31505 12.6856L2.26638 8.71605C1.92998 8.27804 2.01235 7.65025 2.45036 7.31385L3.04518 6.85702C3.59269 6.43652 4.37742 6.53949 4.79792 7.087L6.30583 9.05037Z"
        fill={'currentColor'}
      />
    </StyledSvg>
  );
};

export default Checkmark;
