import Dropdown from 'react-select';

import styled from '../styled-components';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value: DropdownOption;
  onChange: (val: DropdownOption) => void;
  ariaLabel: string;
}

export const StyledDropdown = styled(Dropdown)`
  && {
    display: inline-block;
    position: relative;
    width: auto;
    min-width: 100px;
    border-radius: 2px;
    box-sizing: border-box;
    vertical-align: bottom;
    outline: none;

    font-family: ${(props) => props.theme.typography.headings.fontFamily};
    font-size: 0.929em;
    line-height: 1.5em;

    background: ${({ theme }) => theme.rightPanel.textColor};
    color: #263238;

    cursor: pointer;

    transition: border 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;

    &:hover,
    &:focus-within {
      border: 1px solid ${(props) => props.theme.colors.border.light};
      box-shadow: 0px 0px 0px 1px ${(props) => props.theme.colors.primary.main};

      color: ${(props) => props.theme.colors.primary.main};
    }

    .react-dropdown__control {
      min-height: 0;
      border: 1px solid rgba(38, 50, 56, 0.5);
      border-radius: 2px;

      .react-dropdown__value-container {
        padding: 4px 8px;
      }

      .react-dropdown__indicator-separator {
        display: none;
      }

      .react-dropdown__indicator {
        margin: 4px 8px 2px 0;
        padding: 0;
        border-color: ${(props) => props.theme.colors.primary.main} transparent transparent;
        border-style: solid;
        border-width: 0.35em 0.35em 0;

        svg {
          display: none;
        }
      }
    }

    .react-dropdown__menu {
      margin: 4px 0 8px;
      border-radius: 2px;
      z-index: 3;

      .react-dropdown__menu-list {
        padding: 2px 0;

        .react-dropdown__option {
          padding: 6px 0px 6px 10px;

          color: rgb(38, 50, 56);
          background-color: ${({ theme }) => theme.rightPanel.textColor};

          &:hover {
            background-color: rgba(38, 50, 56, 0.12);
          }
        }

        .react-dropdown__option--is-selected {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .react-dropdown__option--is-focused {
          background-color: rgba(38, 50, 56, 0.12);
        }
      }
    }
  }
`;

export const SimpleDropdown = styled(StyledDropdown)`
  && {
    margin-left: 10px;
    border: none;

    font-size: 0.969em;
    text-transform: none;

    background: transparent;

    .react-dropdown__control {
      border: none;

      .react-dropdown__indicator {
        margin: 4px 8px 0px 0;
      }
    }

    &:hover,
    &:focus-within {
      .react-dropdown__single-value {
        color: ${(props) => props.theme.colors.primary.main};
        text-shadow: 0px 0px 0px ${(props) => props.theme.colors.primary.main};
      }
    }
  }
`;

export const MimeLabel = styled.span`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.929em;
  color: black;
`;
