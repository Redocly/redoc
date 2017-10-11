import styled, { css } from '../styled-components';

const headerFontSize = {
  '1': '1.85714em',
  '2': '1.57143em',
};

export const headerCommonMixin = level => css`
  font-family: ${props => props.theme.headingsFont.family};
  font-weight: 400;
  font-size: ${headerFontSize[level]};
`;

export const H1 = styled.h1`
  ${headerCommonMixin(1)};
  color: ${props => props.theme.colors.main};
  text-transform: capitalize;
`;

export const H2 = styled.h2`
  ${headerCommonMixin(2)};
  color: black;
`;

export const UnderlinedHeader = styled.h5`
  border-bottom: 1px solid rgba(38, 50, 56, 0.3);
  margin: 1em 0 1em 0;
  color: rgba(38, 50, 56, 0.5);
  font-weight: normal;
  text-transform: uppercase;
  font-size: 0.929em;
  line-height: 20px;
`;
