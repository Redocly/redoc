import * as React from 'react';
import styled, { keyframes } from '../../styled-components';

const _Spinner = (props: { className?: string; color: string }) => (
  <svg className={props.className} width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 0C9.4 0 0 9.4 0 21C0 32.6 9.4 42 21 42C32.6 42 42 32.6 42 21C42 9.4 32.6 0 21 0ZM21 35C13.27 35 7 28.73 7 21C7 13.27 13.27 7 21 7C28.73 7 35 13.27 35 21C35 28.73 28.73 35 21 35Z"/>
    <path id="rotator" d="M21 1V6C28.94 6 35.45 12.18 35.96 20H40.97C40.45 9.42 31.71 1 21 1Z" fill="white"/>
  </svg>

);

const rotate = keyframes`
  0% {
    transform: rotate(0deg); }
  100% {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled(_Spinner)`
  animation: 1.5s ${rotate} linear infinite;
  width: 42px;
  height: 42px;
  content: '';
  display: inline-block;
  margin-left: -25px;

  path:not(#rotator) {
    fill: ${props => props.color};
  }
`;
