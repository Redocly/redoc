import { useCallback, useState } from 'react';

import type { TabType } from '../../models/tab.js';

import { useMount } from '@redocly/theme/core/openapi';

interface UseTabsStateProps {
  tabs: TabType[];
  defaultTab?: string;
  onChange?: (key: string) => void;
}

export function useTabsState({ tabs, defaultTab, onChange }: UseTabsStateProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].key);

  useMount(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
      onChange?.(defaultTab);
    }
  });

  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (activeTab !== tab.key) {
        setActiveTab(tab.key);
      }
      onChange?.(tab.key);
    },
    [activeTab, onChange],
  );

  return {
    activeTab,
    handleTabChange,
  };
}
