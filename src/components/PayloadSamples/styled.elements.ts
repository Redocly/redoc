import { transparentize } from 'polished';
import styled from '../../styled-components';
import { StyledDropdown } from '../../common-elements';

export const MimeLabel = styled.div`
  padding: 0.9em;
  background-color: ${({ theme }) => transparentize(0.6, theme.rightPanel.backgroundColor)};
  margin: 0 0 10px 0;
  display: block;
  font-family: ${({ theme }) => theme.typography.headings.fontFamily};
  font-size: 0.929em;
  line-height: 1.5em;
`;

export const DropdownLabel = styled.span`
  font-family: ${({ theme }) => theme.typography.headings.fontFamily};
  font-size: 12px;
  position: absolute;
  z-index: 1;
  top: -11px;
  left: 12px;
  font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  color: ${({ theme }) => transparentize(0.3, theme.rightPanel.textColor)};
`;

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const InvertedSimpleDropdown = styled(StyledDropdown)`
  && {
    display: block;
    border: none;
    margin: 0 0 10px 0;
    padding: 0.9em 1.6em 0.9em 0.9em;
    box-shadow: none;

    text-transform: none;

    background-color: ${({ theme }) => transparentize(0.6, theme.rightPanel.backgroundColor)};

    &:hover,
    &:focus-within {
      border-bottom: 1px solid ${({ theme }) => theme.rightPanel.textColor};
      border-right: 1px solid ${({ theme }) => theme.rightPanel.textColor};
      border-left: 1px solid ${({ theme }) => theme.rightPanel.textColor};
      border-top: none;
      box-shadow: none;

      background-color: ${({ theme }) => transparentize(0.3, theme.rightPanel.backgroundColor)};
    }

    .react-dropdown__control {
      border: transparent;
      background-color: transparent;

      .react-dropdown__single-value {
        color: ${({ theme }) => theme.rightPanel.textColor};
      }

      .react-dropdown__indicator {
        border-color: ${({ theme }) => theme.rightPanel.textColor} transparent transparent;
      }
    }

    .react-dropdown__menu {
      left: 0;
    }
  }
`;

export const NoSampleLabel = styled.div`
  font-family: ${(props) => props.theme.typography.code.fontFamily};
  font-size: 12px;
  color: #ee807f;
`;
