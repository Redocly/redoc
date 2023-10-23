import styled, { css, extensionsHook } from '../styled-components';

const headerFontSize = {
  1: '1.85714em',
  2: '1.57143em',
  3: '1.27em',
};

export const headerCommonMixin = level => css`
  font-family: ${({ theme }) => theme.typography.headings.fontFamily};
  font-weight: ${({ theme }) => theme.typography.headings.fontWeight};
  font-size: ${headerFontSize[level]};
  line-height: ${({ theme }) => theme.typography.headings.lineHeight};
`;

export const H1 = styled.h1`
  ${headerCommonMixin(1)};
  color: ${({ theme }) => theme.colors.text.primary};

  ${extensionsHook('H1')};
`;

export const H2 = styled.h2`
  ${headerCommonMixin(2)};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px;

  ${extensionsHook('H2')};
`;

export const H3 = styled.h2`
  ${headerCommonMixin(3)};
  color: ${({ theme }) => theme.colors.text.primary};

  ${extensionsHook('H3')};
`;

export const RightPanelHeader = styled.div`
  color: #ffffff;
  padding: 10px;
  font-weight: 700;
  border-radius: 4px 4px 0 0;
  background: rgb(50, 63, 75);
  ${extensionsHook('RightPanelHeader')};
`;

export const UnderlinedHeader = styled.h5`
  margin: 1em 0 1em 0;
  color: rgb(96, 106, 119);
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.929em;
  line-height: 20px;

  ${extensionsHook('UnderlinedHeader')};
`;
