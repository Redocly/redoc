import styled, { css, extensionsHook } from '../styled-components';

const headerFontSize = {
  1: '1.85714em',
  2: '1.57143em',
  3: '1.27em',
  4: '1.17em',
  5: '1.07em',
  6: '1em',
};

export const headerCommonMixin = (level) => css`
  font-family: ${({ theme }) => theme.typography.headings.fontFamily};
  font-weight: ${({ theme }) => theme.typography.headings.fontWeight};
  font-size: ${headerFontSize[level]};
  line-height: ${({ theme }) => theme.typography.headings.lineHeight};
`;

export const H1 = styled.h1`
  ${headerCommonMixin(1)};
  color: ${({ theme }) => theme.colors.primary.main};

  ${extensionsHook('H1')};
`;

export const H2 = styled.h2`
  ${headerCommonMixin(2)};
  color: black;

  ${extensionsHook('H2')};
`;

export const H3 = styled.h3`
  ${headerCommonMixin(3)};
  color: black;

  ${extensionsHook('H3')};
`;

export const H4 = styled.h4`
  ${headerCommonMixin(4)};
  color: black;

  ${extensionsHook('H4')};
`;

export const H5 = styled.h5`
  ${headerCommonMixin(5)};
  color: black;

  ${extensionsHook('H5')};
`;

export const H6 = styled.h6`
  ${headerCommonMixin(6)};
  color: black;

  ${extensionsHook('H6')};
`;

export const headings = () => {
  return { H1, H2, H3, H4, H5, H6 };
};

export const RightPanelHeader = styled.h3`
  color: ${({ theme }) => theme.rightPanel.textColor};

  ${extensionsHook('RightPanelHeader')};
`;

export const UnderlinedHeader = styled.h5`
  border-bottom: 1px solid rgba(38, 50, 56, 0.3);
  margin: 1em 0 1em 0;
  color: rgba(38, 50, 56, 0.5);
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.929em;
  line-height: 20px;

  ${extensionsHook('UnderlinedHeader')};
`;
