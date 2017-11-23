import styled from '../../styled-components';

export const LogoImgEl = styled.img`
  max-height: ${props => props.theme.logo.maxHeight};
  width: auto;
  display: inline-block;
  max-width: 100%;
`;

export const LogoWrap = styled.div`
  text-align: center;
`;
