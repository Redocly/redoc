import { darken } from 'polished';
import * as React from 'react';
import styled from '../../styled-components';
import { MenuItemLabel } from '../SideMenu/styled.elements';

export const SearchWrap = styled.div`
  padding: 5px 0;
`;

export const LinkWrap = styled.a`
  text-decoration: none;
`;

export const SearchInput = styled.input.attrs(() => ({
  className: 'search-input',
}))`
  width: calc(100% - ${props => props.theme.spacing.unit * 8}px);
  box-sizing: border-box;
  margin: 0 ${props => props.theme.spacing.unit * 4}px;
  padding: 5px ${props => props.theme.spacing.unit * 2}px 5px
    ${props => props.theme.spacing.unit * 4}px;
  border: 0;
  border-bottom: 1px solid ${({theme}) => darken(0.1, theme.menu.backgroundColor)};
  font-family: ${({theme}) => theme.typography.fontFamily};
  font-size: 1em;
  color: ${props => props.theme.menu.textColor};
  background-color: transparent;
  outline: none;
`;

export const SearchIcon = styled((props: { className?: string }) => (
  <svg
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    className={props.className}
    viewBox="0 0 24 24"
    xmlSpace="preserve"
  >
    <g>
      <path
        className="st0"
        d="M22.7,21.5l-5.1-5c1.5-1.7,2.4-4,2.4-6.5c0-5.5-4.5-10-10-10S0,4.5,0,10s4.5,10,10,10c2.3,0,4.4-0.8,6.1-2.1
		l5.2,5.1c0.2,0.2,0.4,0.3,0.7,0.3c0.3,0,0.5-0.1,0.7-0.3C23.1,22.5,23.1,21.9,22.7,21.5z M10,18c-4.4,0-8-3.6-8-8s3.6-8,8-8
		s8,3.6,8,8S14.4,18,10,18z"
      />
    </g>
  </svg>
)).attrs({
  className: 'search-icon',
})`
  position: absolute;
  left: ${props => props.theme.spacing.unit * 4}px;
  height: 1.8em;
  width: 0.9em;

  path {
    fill: ${props => props.theme.menu.textColor};
  }
`;

export const SearchResultsBox = styled.div`
  padding: ${props => props.theme.spacing.unit}px 0;
  background-color: #ededed;
  min-height: 150px;
  max-height: 250px;
  border-top: 1px solid #e1e1e1;
  border-bottom: 1px solid #e1e1e1;
  margin-top: 10px;
  line-height: 1.4;
  font-size: 0.9em;

  ${MenuItemLabel} {
    padding-top: 6px;
    padding-bottom: 6px;

    &:hover {
      background-color: #e1e1e1;
    }

    > svg {
      display: none;
    }

    &.active {
      background-color: #e1e1e1;
    }
  }
`;

export const ClearIcon = styled.i`
  position: absolute;
  display: inline-block;
  width: ${props => props.theme.spacing.unit * 2}px;
  text-align: center;
  right: ${props => props.theme.spacing.unit * 4}px;
  line-height: 2em;
  vertical-align: middle;
  margin-right: 2px;
  cursor: pointer;
  font-style: normal;
  color: '#666';
`;
