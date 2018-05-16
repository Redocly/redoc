import { Tabs as ReactTabs, TabsProps } from 'react-tabs';
import styled, { ResolvedThemeInterface, StyledComponentClass } from '../styled-components';

export { Tab, TabList, TabPanel } from 'react-tabs';

export const Tabs = styled(ReactTabs)`
  > ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;

    > li {
      padding: 5px 10px;
      display: inline-block;
      flex: 1;
      background-color: rgba(0, 0, 0, 0.2);
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      cursor: pointer;
      text-align: center;
      outline: none;
      color: #ccc;

      &.react-tabs__tab--selected {
        color: #fff;
        background: rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid ${props => props.theme.schemaView.linesColor};
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
      padding: 0;
      margin-right: 20px;
      font-size: 12px;
      padding: 2px 0;
      border-bottom: 1px dashed;
      color: #787b7d;
      backgrond: none;

      &:last-child {
        margin-right: 0;
      }

      &.react-tabs__tab--selected {
        backgrond: none;
        color: #babcbf;
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
