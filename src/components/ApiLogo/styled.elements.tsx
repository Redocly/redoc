import * as React from 'react';
import styled from '../../styled-components';

export const LogoImgEl = styled.img`
  max-height: ${props => props.theme.logo.maxHeight};
  width: auto;
  display: block;
  max-width: 100%;
`;

export const LogoWrap = styled.div`
  text-align: center;
`;

const Link = styled.a`
  display: inline-block;
`;

export const LinkWrap = url => Component => <Link href={url}>{Component}</Link>;
