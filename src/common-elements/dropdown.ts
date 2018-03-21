import Dropdown from 'react-dropdown';

import styled, { StyledComponentClass, withProps } from '../styled-components';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: DropdownOption;
  onChange: (val: DropdownOption) => void;
}

export const StyledDropdown = withProps<DropdownProps>(styled(Dropdown))`
  min-width: 100px;
  display: inline-block;
  position: relative;
  width: auto;
  font-family: ${props => props.theme.headingsFont.family};

  .Dropdown-control  {
    font-family: ${props => props.theme.headingsFont.family};
    position: relative;
    font-size: .929em;
    width: 100%;
    line-height: 1.5em;
    vertical-align: middle;
    cursor: pointer;
    border-color: rgba(38, 50, 56, 0.5);
    color: #263238;
    outline: none;
    padding: 0.15em 1.5em 0.2em 0.5em;
    border-radius: 2px;
    border-width: 1px;
    border-style: solid;
    margin-top: 5px;
    background: white;

    &:hover {
      border-color: ${props => props.theme.colors.main};
      color: ${props => props.theme.colors.main};
      box-shadow: 0px 2px 4px 0px rgba(34, 36, 38, 0.12);
    }
  }

  .Dropdown-arrow {
    border-color: ${props => props.theme.colors.main} transparent transparent;
    border-style: solid;
    border-width: 0.35em 0.35em 0;
    content: ' ';
    display: block;
    height: 0;
    position: absolute;
    right: 0.35em;
    top: 50%;
    margin-top: -0.125em;
    width: 0;
  }

  .Dropdown-menu {
    position: absolute;
    margin-top: 2px;
    left: 0;
    right: 0;

    z-index: 10;
    min-width: 100px;

    background: white;
    border: 1px solid rgba(38, 50, 56, 0.2);
    box-shadow: 0px 2px 4px 0px rgba(34, 36, 38, 0.12), 0px 2px 10px 0px rgba(34, 36, 38, 0.08);
  }

  .Dropdown-option {
    font-size: 0.9em;
    color: #263238;
    cursor: pointer;
    padding: 0.4em;

    &.is-selected {
      background-color: rgba(0, 0, 0, 0.05)
    }

    &:hover {
      background-color: rgba(38, 50, 56, 0.12)
    }
  }
` as StyledComponentClass<any, DropdownProps>;

export const SimpleDropdown = StyledDropdown.extend`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.929em;

  .Dropdown-control  {
    font-size: 1em;
    border: none;
    padding: 0 1.2em 0 0;
    background: transparent;

    &:hover {
      color: ${props => props.theme.colors.main};
      box-shadow: none;
    }
`;

export const MimeLabel = styled.span`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.929em;
  color: black;
`;
