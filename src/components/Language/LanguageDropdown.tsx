import { useCallback, useMemo } from 'react';

import type { ReactElement } from 'react';
import type { TabType } from '../../models/tab.js';

import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';
import { DropdownMenu } from '@redocly/theme/components/Dropdown/DropdownMenu';

import { LanguageItem } from './LanguageItem.js';
import { DropdownTriggerButton, StyledDropdownMenuItem } from './styled.js';

export interface LanguageDropdownProps {
  samples: TabType<{ lang: string }>[];
  activeTab?: string;
  onChange: (key: string) => void;
  trigger?: ReactElement;
  withArrow?: boolean;
  withCheckmark?: boolean;
  withIcon?: boolean;
  width?: number;
}

export const LanguageDropdown = ({
  samples,
  activeTab,
  onChange,
  trigger,
  width,
  withArrow = true,
  withCheckmark = true,
  withIcon = true,
}: LanguageDropdownProps): ReactElement => {
  const handleAction = useCallback(
    (value) => () => {
      const selectedSample = samples.find(({ key }) => key === value.key);

      if (selectedSample) {
        onChange(selectedSample.key);
      }
    },
    [onChange, samples],
  );

  const items = useMemo(
    () =>
      samples.map((item) => {
        return (
          <StyledDropdownMenuItem key={item.key} $width={width} onAction={handleAction(item)}>
            <LanguageItem
              item={item}
              active={activeTab === item.key}
              withCheckmark={withCheckmark}
              withIcon={withIcon}
            />
          </StyledDropdownMenuItem>
        );
      }),
    [activeTab, handleAction, samples, width, withCheckmark, withIcon],
  );

  const activeSample = samples.find(({ key }) => key === activeTab);

  const dropdownTrigger = trigger || (
    <DropdownTriggerButton variant="ghost">{activeSample?.title}</DropdownTriggerButton>
  );

  return items.length > 1 ? (
    <Dropdown trigger={dropdownTrigger} withArrow={withArrow} alignment="end">
      <DropdownMenu>{items}</DropdownMenu>
    </Dropdown>
  ) : (
    dropdownTrigger
  );
};
