import * as React from 'react';
import styled, { ResolvedThemeInterface, StyledComponentClass } from '../styled-components';


export const Button = styled.button`
  background: #248fb2;
  border-radius: 0px;
  border: none;
  color: white;
  font-size: 0.929em;
  padding: 5px;
`;

export const SendButton = Button.extend`
  background: #B0045E;
`;