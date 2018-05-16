import * as React from 'react';
import styled, { ResolvedThemeInterface, StyledComponentClass } from '../../styled-components';

export const LogoImgEl = styled.img`
  max-height: ${props => props.theme.logo.maxHeight};
  max-width: ${props => props.theme.logo.maxWidth};
  width: 100%;
  display: block;
`;

export const LogoWrap = styled.div`
  text-align: center;
`;

const Link = styled.a`
  display: inline-block;
`;

export const LinkWrap = url => Component => <Link href={url}>{Component}</Link>;
