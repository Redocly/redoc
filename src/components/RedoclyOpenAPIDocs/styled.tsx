import { styled } from '../../styled-components.js';

export const RedocWrap = styled.div<{ $offset: number }>`
  display: flex;
  position: relative;
  text-align: left;
  background-color: var(--bg-color);
  tap-highlight-color: rgba(0, 0, 0, 0);
  text-size-adjust: 100%;
  text-rendering: var(--text-rendering, auto) !important;

  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-weight: var(--font-weight-regular);
  color: var(--text-color-primary);
  -webkit-font-text-smoothing: var(--text-smoothing);
  margin-top: ${({ $offset }) => $offset || 0}px;

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }
  [id] {
    scroll-margin-top: ${({ $offset }) => $offset || 0}px;
  }
`;
