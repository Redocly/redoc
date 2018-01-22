import psStyles from 'perfect-scrollbar/css/perfect-scrollbar.css';
import styled, { injectGlobal } from '../styled-components';

import PerfectScrollbarOriginal from 'react-perfect-scrollbar';

injectGlobal`${psStyles}`;

export const PerfectScrollbar = styled(PerfectScrollbarOriginal)`
  position: relative;
`;
