import { css } from 'styled-components';

export const deprecatedCss = css`
  text-decoration: line-through;
  color: #bdccd3;
`;

export const hoverColor = color => {
  if (!color) {
    return '';
  }
  return css`
    &:hover {
      color: ${color};
    }
  `;
};
