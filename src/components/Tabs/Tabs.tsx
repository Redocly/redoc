import { css } from 'styled-components';

import type { TabType } from '../../models/tab.js';

import { StatusCode } from '@redocly/theme/components/StatusCode/StatusCode';

import { styled } from '../../styled-components.js';

type TabsProps = {
  tabs: TabType[];
  onChange: (tab: TabType) => void;
  activeTab?: TabType;
};

export function Tabs({ tabs, onChange, activeTab }: TabsProps) {
  return (
    <TabList>
      {tabs.map((tab) => (
        <Tab key={tab.key} $active={tab.key === activeTab?.key} onClick={() => onChange(tab)}>
          <StatusCode status={tab.key}>{tab.title}</StatusCode>
        </Tab>
      ))}
    </TabList>
  );
}

const TabList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Tab = styled.li<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  list-style: none;

  padding: 0 var(--spacing-sm);
  background-color: transparent;
  height: 24px;
  border-radius: var(--border-radius);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-base);

  &,
  button {
    color: var(--text-color-secondary);

    ${({ $active }) =>
      $active
        ? css`
            color: var(--text-color-primary);
            background-color: var(--tab-bg-color-filled);
          `
        : css`
            &:hover {
              color: var(--text-color-primary);
            }
          `}
  }
`;
