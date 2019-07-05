// @ts-ignore
import Dropdown from 'react-dropdown';

import { transparentize } from 'polished';
import styled from '../../styled-components';

import { StyledDropdown } from '../../common-elements';

export const MimeLabel = styled.div`
  padding: 12px;
  background-color: ${({ theme }) => transparentize(0.6, theme.rightPanel.backgroundColor)};
  margin: 0 0 10px 0;
  display: block;
`;

export const DropdownLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.headings.fontFamily};
  font-size: 12px;
  position: absolute;
  z-index: 1;
  top: -11px;
  left: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  color: ${({ theme }) => transparentize(0.6, theme.rightPanel.textColor)};
`;

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const InvertedSimpleDropdown = styled(StyledDropdown)`
  margin-left: 10px;
  text-transform: none;
  font-size: 0.929em;
  padding: 12px;
  margin: 0 0 10px 0;
  display: block;
  background-color: ${({ theme }) => transparentize(0.6, theme.rightPanel.backgroundColor)};
  .Dropdown-control {
    margin-top: 0;
  }
  .Dropdown-control,
  .Dropdown-control:hover {
    font-size: 1em;
    border: none;
    padding: 0 1.2em 0 0;
    background: transparent;
    color: ${({ theme }) => theme.rightPanel.textColor};
    box-shadow: none;

    .Dropdown-arrow {
      border-top-color: ${({ theme }) => theme.rightPanel.textColor};
    }
  }
  .Dropdown-menu {
    margin: 0;
    margin-top: 10px;
  }
`;

export const NoSampleLabel = styled.div`
  font-family: ${props => props.theme.typography.code.fontFamily};
  font-size: 12px;
  color: #ee807f;
`;

export const Description = styled.span`
  font-size: 12px;
  color: ${({ theme }) => transparentize(0.6, theme.rightPanel.textColor)};
`;
