import { transparentize } from 'polished';
import styled from '../../styled-components';
import { Dropdown } from '../../common-elements/Dropdown';

export const MimeLabel = styled.div`
  padding: 0.9em;
  background-color: rgb(50, 63, 75);
  margin: 0 0 10px 0;
  display: block;
  font-family: ${({ theme }) => theme.typography.headings.fontFamily};
  font-size: 0.929em;
  line-height: 1.5em;
  border-radius: 4px;
`;

export const DropdownLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.headings.fontFamily};
  font-size: 12px;
  position: absolute;
  z-index: 1;
  top: -11px;
  left: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  color: ${({ theme }) => transparentize(0.1, theme.rightPanel.textColor)};
`;

export const DropdownWrapper = styled.div`
  margin-top: 15px;
  position: relative;
`;

export const InvertedSimpleDropdown = styled(Dropdown)`
  label {
    color: ${({ theme }) => theme.rightPanel.textColor};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 1em;
    text-transform: none;
    border: none;
  }
  margin: 0 0 10px 0;
  display: block;
  background-color: rgb(50, 63, 75);
  border: none;
  padding: 0.9em 1.6em 0.9em 0.9em;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: none;
  &:hover,
  &:focus-within {
    border: none;
    box-shadow: none;
  }
`;

export const NoSampleLabel = styled.div`
  font-family: ${props => props.theme.typography.code.fontFamily};
  font-size: 12px;
  color: #ee807f;
`;
