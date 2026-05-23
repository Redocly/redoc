import { darken } from 'polished';
import { Tabs as ReactTabs } from 'react-tabs';

import styled from '../styled-components';

export { Tab, TabList, TabPanel } from 'react-tabs';

export const Tabs = styled(ReactTabs)`
  padding: 10px 20px 20px;
  color: rgb(245, 247, 250);
  border-radius: 0 0 4px 4px;
  background-color: rgb(82, 96, 109);

  > ul {
    list-style: none;
    padding: 0;
    margin: 0 0 10px;
    border-bottom: 4px solid rgb(97, 110, 124);
    > li {
      padding: 5px 10px;
      display: inline-block;

      background-color: rgb(82, 96, 109);
      cursor: pointer;
      text-align: center;
      outline: none;
      color: ${({ theme }) => darken(theme.colors.tonalOffset, theme.rightPanel.textColor)};
      min-width: 60px;
      font-size: 0.9em;
      font-weight: bold;

      &.react-tabs__tab--selected {
        color: white;
        background: rgb(50, 63, 75);
        border-bottom: 4px solid rgb(89, 195, 255);
        margin-bottom: -4px;
      }

      &:only-child {
        flex: none;
        min-width: 100px;
      }
    }

    > li:first-of-type {
      border-top-left-radius: 4px;
    }

    > li:last-of-type {
      border-top-right-radius: 4px;
    }
  }
  > .react-tabs__tab-panel {
    background: ${({ theme }) => theme.codeBlock.backgroundColor};
    & > div,
    & > pre {
      margin-top: 10px;
    }

    & > div > pre {
      padding: 10px;
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
      padding: ${props => props.theme.spacing.unit * 2}px 10px;
    }
  }
`;
