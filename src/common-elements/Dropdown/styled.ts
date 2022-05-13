import styled from 'styled-components';

import { Dropdown as DropdownComponent } from './Dropdown';

export const Dropdown = styled(DropdownComponent)<{
  fullWidth?: boolean;
}>`
  label {
    box-sizing: border-box;
    min-width: 100px;
    outline: none;
    display: inline-block;
    font-family: ${props => props.theme.typography.headings.fontFamily};
    color: ${({ theme }) => theme.colors.text.primary};
    vertical-align: bottom;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    text-transform: none;
    padding: 0 22px 0 4px;

    font-size: 0.929em;
    line-height: 1.5em;
    font-family: inherit;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .dropdown-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    border: none;
    appearance: none;
    cursor: pointer;

    color: ${({ theme }) => theme.colors.text.primary};
    line-height: inherit;
    font-family: inherit;
  }
  box-sizing: border-box;
  min-width: 100px;
  outline: none;
  display: inline-block;
  border-radius: 2px;
  border: 1px solid rgba(38, 50, 56, 0.5);
  vertical-align: bottom;
  padding: 2px 0px 2px 6px;
  position: relative;
  width: auto;
  background: white;
  color: #263238;
  font-family: ${props => props.theme.typography.headings.fontFamily};
  font-size: 0.929em;
  line-height: 1.5em;
  cursor: pointer;
  transition: border 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;

  &:hover,
  &:focus-within {
    border: 1px solid ${props => props.theme.colors.primary.main};
    color: ${props => props.theme.colors.primary.main};
    box-shadow: 0px 0px 0px 1px ${props => props.theme.colors.primary.main};
  }
`;

export const SimpleDropdown = styled(Dropdown)`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.969em;

  font-size: 1em;
  border: none;
  padding: 0 1.2em 0 0;
  background: transparent;

  &:hover,
  &:focus-within {
    border: none;
    box-shadow: none;
    label {
      color: ${props => props.theme.colors.primary.main};
      text-shadow: 0px 0px 0px ${props => props.theme.colors.primary.main};
    }
  }
`;

export const MimeLabel = styled.span`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.929em;
  color: black;
`;
