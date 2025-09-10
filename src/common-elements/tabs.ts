import { darken } from 'polished';
import { Tabs as ReactTabs } from 'react-tabs';

import styled from '../styled-components';

export { Tab, TabList, TabPanel } from 'react-tabs';

export const RequestSamplesTabs = styled(ReactTabs)`
  > ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin: 0 -5px;

    > li {
      color: rgb(0, 0, 0);
      background: rgb(255, 255, 255);
      padding: 2px 5px;
      display: inline-block;

      cursor: pointer;
      text-align: center;
      outline: none;
      margin: 0
        ${({ theme }) => `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px`};
      border: 1px solid rgb(245, 245, 245);
      border-radius: 5px;
      min-width: 50px;
      font-size: 0.9em;
      font-weight: bold;

      &.react-tabs__tab--selected {
        color: rgb(55, 181, 255);
        border-color: rgb(55, 181, 255);
        background: rgb(255, 255, 255);
      }

      &:only-child {
        flex: none;
      }

      &.tab-success {
        color: ${props => props.theme.colors.responses.success.color};
      }

      &.tab-redirect {
        color: ${props => props.theme.colors.responses.redirect.color};
      }

      &.tab-info {
        color: ${props => props.theme.colors.responses.info.color};
      }

      &.tab-error {
        color: ${props => props.theme.colors.responses.error.color};
      }
    }
  }
  > .react-tabs__tab-panel {
    border: 1px solid rgb(242, 242, 242);
    background: rgb(245, 245, 245);
    border-radius: 4px;
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

export const Tabs = styled(ReactTabs)`
  > ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin: 0 -5px;

    > li {
      padding: 2px 5px;
      display: inline-block;

      background-color: ${({ theme }) => theme.codeSample.backgroundColor};
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      cursor: pointer;
      text-align: center;
      outline: none;
      color: ${({ theme }) => darken(theme.colors.tonalOffset, theme.rightPanel.textColor)};
      margin: 0
        ${({ theme }) => `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px`};
      border: 1px solid ${({ theme }) => darken(0.05, theme.codeSample.backgroundColor)};
      border-radius: 5px;
      min-width: 50px;
      font-size: 0.9em;
      font-weight: bold;

      &.react-tabs__tab--selected {
        color: rgb(0, 170, 19);
        background-color: rgba(0, 170, 19, 0.1);
        border-color: transparent;
      }

      &:only-child {
        flex: none;
      }

      &.tab-success {
        color: ${props => props.theme.colors.responses.success.color};
      }

      &.tab-redirect {
        color: ${props => props.theme.colors.responses.redirect.color};
      }

      &.tab-info {
        color: ${props => props.theme.colors.responses.info.color};
      }

      &.tab-error {
        color: ${props => props.theme.colors.responses.error.color};
      }
    }
  }
  > .react-tabs__tab-panel {
    border: 1px solid rgb(242, 242, 242);
    background: rgb(245, 245, 245);
    border-radius: 4px;
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
