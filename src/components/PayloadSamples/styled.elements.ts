import { transparentize } from 'polished';
import styled from '../../styled-components';
import { StyledDropdown, RightPanelHeaderDiv } from '../../common-elements';

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
    margin-left: 10px;
    text-transform: none;
    font-size: 0.929em;
    margin: 0 0 10px 0;
    display: block;
    background-color: ${({ theme }) => transparentize(0.6, theme.rightPanel.backgroundColor)};
    font-size: 1em;
    border: none;
    padding: 0.9em 1.6em 0.9em 0.9em;
    box-shadow: none;
    &:hover,
    &:focus-within {
      border: none;
      box-shadow: none;
    }
    &:focus-within {
      background-color: ${({ theme }) => transparentize(0.3, theme.rightPanel.backgroundColor)};
    }

    .dropdown-arrow {
      border-top-color: ${({ theme }) => theme.rightPanel.textColor};
    }
    .dropdown-selector-value {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: ${({ theme }) => theme.rightPanel.textColor};
    }

    .dropdown-selector-content {
      margin: 0;
      margin-top: 2px;
      .dropdown-option {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
`;

export const NoSampleLabel = styled.div`
  font-family: ${props => props.theme.typography.code.fontFamily};
  font-size: 12px;
  color: #ee807f;
`;

export const TryUrlTop = styled.div`
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: Courier, monospace;
  width: 100%;
  text-align: left;
  border: 1px solid #ccc;
  background: #fff;
  word-break: break-all;
  background-color: rgba(38, 50, 56, 0.4);
  border-color: rgba(38, 50, 56, 0.5);
  font-size: 1em;
  border: none;
  color: ${props => props.theme.colors.primary.main};
`;

export const TryUrl = styled(TryUrlTop)`
  background-color: rgba(38, 50, 56, 0.4);
  padding: 10px;
  > div:nth-child(1) {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(38, 50, 56, 0.5);
    padding: 6px 8px;
    border-radius: 3px;

    width: calc(100% - 50px);
    > span {
      flex: 1;

      font-family: Courier, monospace;
      font-size: 0.95em;
      background: transparent;
      color: #ffffff !important;
      outline: none;
      border: none;
      text-align: left;

      > span {
        color: #a0fbaa !important;
      }
    }
  }
`;

export const TryBtn = styled.div`
  flex: 0 0 auto;
  margin: 5px 0 5px 8px;
  font-size: 0.9em;
  font-weight: 400;
  line-height: 24px;
  background: white;
  border-radius: 2px;
  width: 52px;
  text-align: center;
  text-transform: uppercase;
  font-family: Montserrat, sans-serif;
  cursor: pointer;
  > span {
    padding: 5px;
    color: black !important;
    margin: 0;
  }
`;

export const TryTitle = styled(RightPanelHeaderDiv)`
  font-size: 1.2em;
  padding: 5px 0;
  font-weight: 400;
`;

export const TrySubtitle = styled(RightPanelHeaderDiv)`
  font-size: 1.1em;
  padding: 4px 0;
  font-weight: 300;
`;

export const ParamBox = styled(TryUrlTop)`
  padding: 10px 0;
  margin-top: 15px;
  position: relative;
`;

export const ParamPrompt = styled.div`
  padding: 4px 0;
  font-weight: 300;
  font-size: 0.9em;
  line-height: 18px;
  color: #ffffff !important;
`;

export const ParamInput = styled(TryUrlTop)`
  max-width: 250px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  font-size: 0.9em;
  > input {
    padding: 0.5em;
    width: 100%;
    font-family: Courier, monospace;
    background: transparent;
    color: #a0fbaa !important;
    outline: none;
    border: none;
    word-break: break-all;
  }
`;

export const ParamTable = styled.div`
  width: 100%;
  background: none;
  > table {
    width: 100%;
    tab-index: -1;
    cell-padding: 1;
    cell-spacing: 0;

    td {
      vertical-align: middle;
      text-align: right;
      padding: 5px 10px 0 10px;
    }
    td:nth-child(2) {
      text-align: left;
      max-width: 200px;
    }
  }
`;
