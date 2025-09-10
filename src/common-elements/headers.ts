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
  color: ${({ theme }) => theme.colors.primary.main};

  ${extensionsHook('H1')};
`;

export const H2 = styled.h2`
  ${headerCommonMixin(2)};
  color: black;

  ${extensionsHook('H2')};
`;

export const H3 = styled.h2`
  ${headerCommonMixin(3)};
  color: black;

  ${extensionsHook('H3')};
`;

export const RightPanelHeader = styled.h3`
  color: #697386;
  font-size: 14px;
  font-weight: 600;

  ${extensionsHook('RightPanelHeader')};
`;

export const UnderlinedHeader = styled.h5`
  color: rgb(0, 0, 0);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.929em;
  line-height: 20px;
  display: inline-block;
  margin: 0;

  ${extensionsHook('UnderlinedHeader')};
`;
