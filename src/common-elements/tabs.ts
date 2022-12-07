import { palette } from '@leafygreen-ui/palette';
import { darken } from 'polished';
import { Tabs as ReactTabs } from 'react-tabs';

import styled from '../styled-components';

export { Tab, TabList, TabPanel } from 'react-tabs';

export const Tabs = styled(ReactTabs)`
  > ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin: 0 -5px;

    > li {
      padding: 5px 10px;
      display: inline-block;

      background-color: ${palette.gray.dark3};
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      cursor: pointer;
      text-align: center;
      outline: none;
      color: ${palette.gray.base};
      margin: 0
        ${({ theme }) => `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px`};
      border: none;
      border-radius: 5px;
      min-width: 60px;
      font-size: 13px;
      font-weight: bold;

      &.react-tabs__tab--selected {
        color: ${palette.white};
        background-color: ${palette.gray.dark2};
        border: 1px solid ${palette.gray.base};
        &:focus {
          outline: auto;
        }

        &.tab-error {
          background-color: ${palette.gray.dark2};
          border: none;
          color: ${palette.red.light1};
        }

        &.tab-success {
          background-color: ${palette.gray.dark2};
          border: none;
          color: ${palette.green.light1};
        }
      }

      &:only-child {
        flex: none;
        min-width: 100px;
      }

      &.tab-redirect {
        color: ${props => props.theme.colors.responses.redirect.tabTextColor};
      }

      &.tab-info {
        color: ${props => props.theme.colors.responses.info.tabTextColor};
      }
    }
  }
  > .react-tabs__tab-panel {
    background: ${({ theme }) => theme.codeBlock.backgroundColor};
    & > div,
    & > pre {
      padding: ${props => props.theme.spacing.unit * 4}px;
      margin: 0;
    }

    & > div > pre {
      padding: 0;
    }
  }
`;

export const SmallTabs = styled(Tabs)`
  > ul {
    display: block;
    > li {
      padding: 2px 5px;
      min-width: auto;
      margin: 0 15px 0 0;
      font-size: 13px;
      font-weight: normal;
      border-bottom: 1px dashed;
      color: ${({ theme }) => darken(theme.colors.tonalOffset, theme.rightPanel.textColor)};
      border-radius: 0;
      background: none;

      &:last-child {
        margin-right: 0;
      }

      &.react-tabs__tab--selected {
        color: ${({ theme }) => theme.rightPanel.textColor};
        background: none;
      }
    }
  }
  > .react-tabs__tab-panel {
    & > div,
    & > pre {
      padding: ${props => props.theme.spacing.unit * 2}px 0;
    }
  }
`;
