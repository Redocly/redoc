import { Tabs as ReactTabs, TabsProps } from 'react-tabs';
import styled, { ResolvedThemeInterface, StyledComponentClass } from '../styled-components';

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

      background-color: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      cursor: pointer;
      text-align: center;
      outline: none;
      color: #ccc;
      margin: 5px;
      border: 1px solid #181f22;
      border-radius: 5px;
      min-width: 60px;
      font-size: 0.9em;
      font-weight: bold;

      &.react-tabs__tab--selected {
        color: ${props => props.theme.colors.text};
        background: #e2e2e2;
      }

      &:only-child {
        flex: none;
        min-width: 100px;
      }

      &.tab-success {
        color: ${props => props.theme.colors.success};
      }

      &.tab-redirect {
        color: ${props => props.theme.colors.redirect};
      }

      &.tab-info {
        color: ${props => props.theme.colors.info};
      }

      &.tab-error {
        color: ${props => props.theme.colors.error};
      }
    }
  }
  > .react-tabs__tab-panel {
    background: #171e21;
    & > div,
    & > pre {
      padding: 20px;
      margin: 0;
    }
  }
`;

export const SmallTabs = Tabs.extend`
  > ul {
    display: block;
    > li {
      padding: 2px 5px;
      min-width: auto;
      margin: 0 15px 0 0;
      font-size: 13px;
      font-weight: normal;
      border-bottom: 1px dashed;
      color: #787b7d;
      border-radius: 0;
      background: none;

      &:last-child {
        margin-right: 0;
      }

      &.react-tabs__tab--selected {
        color: #babcbf;
        background: none;
      }
    }
  }
  > .react-tabs__tab-panel {
    & > div,
    & > pre {
      padding: 10px 0;
      margin: 0;
    }
  }
`;
