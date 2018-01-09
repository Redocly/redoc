import styled, { injectGlobal } from '../styled-components';
import psStyles from 'perfect-scrollbar/dist/css/perfect-scrollbar.css';

import PerfectScrollbarOriginal from 'react-perfect-scrollbar';

injectGlobal`${psStyles}`;

export const PerfectScrollbar = styled(PerfectScrollbarOriginal)`
  position: relative;
`;
