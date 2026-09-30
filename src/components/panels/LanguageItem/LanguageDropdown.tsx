import { useCallback, useMemo } from 'react';

import type { ReactElement } from 'react';
import type { TabType } from '../../../jotai/app.js';

import { Dropdown } from '@redocly/theme/components/Dropdown/Dropdown';

import { RESOURCES, languageOf, useTelemetry } from '../../../telemetry/index.js';
import { LanguageItem } from './LanguageItem.js';
import {
  DropdownTriggerButton,
  RightAlignedDropdownMenu,
  StaticLanguageLabel,
  StyledDropdownMenuItem,
} from './styled.js';

export type LanguageDropdownProps = {
  samples: TabType<{ lang: string }>[];
  activeTab?: string;
  onChange: (key: string) => void;
  trigger?: ReactElement;
  withArrow?: boolean;
  withCheckmark?: boolean;
  withIcon?: boolean;
  width?: number;
};

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
  const telemetry = useTelemetry();
  const handleAction = useCallback(
    (value: TabType<{ lang: string }>) => () => {
      const selectedSample = samples.find(({ key }) => key === value.key);

      if (selectedSample) {
        telemetry.sendSelectLanguageClickedMessage([
          {
            ...RESOURCES.selectLanguageButton,
            language: languageOf(selectedSample.key),
          },
        ]);
        onChange(selectedSample.key);
      }
    },
    [onChange, samples, telemetry],
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

  if (items.length <= 1) {
    return trigger ?? <StaticLanguageLabel>{activeSample?.title}</StaticLanguageLabel>;
  }

  const dropdownTrigger = trigger || (
    <DropdownTriggerButton variant="ghost">{activeSample?.title}</DropdownTriggerButton>
  );

  return (
    <Dropdown trigger={dropdownTrigger} withArrow={withArrow} alignment="end" portalled>
      <RightAlignedDropdownMenu>{items}</RightAlignedDropdownMenu>
    </Dropdown>
  );
};
