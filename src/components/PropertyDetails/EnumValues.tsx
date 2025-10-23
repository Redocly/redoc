import { useState, memo, useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { DescriptionEnumProp, EnumValuesProps } from './types.js';

import { SimpleEnums } from './SimpleEnums.js';
import { DescriptionEnums } from './DescriptionEnums.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { useTranslate } from '../../hooks/index.js';

function getEnums(
  values: EnumValuesProps['values'],
): string[] | { description: string; value: string }[] {
  return (
    (Array.isArray(values) && values) ||
    Object.entries(values || {}).map(([value, description]) => ({
      value,
      description,
    }))
  );
}

function EnumValuesComponent({ values, type }: EnumValuesProps): ReactElement | null {
  const translate = useTranslate();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const { maxDisplayedEnumValues } = useAtomValue(globalOptionsAtom);

  const toggle = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const isDescriptionEnum = !Array.isArray(values);
  const enums = getEnums(values);

  const displayedItems = useMemo(
    () => (isCollapsed && maxDisplayedEnumValues ? enums.slice(0, maxDisplayedEnumValues) : enums),
    [enums, isCollapsed, maxDisplayedEnumValues],
  );

  if (!enums.length) {
    return null;
  }

  const showToggleButton = maxDisplayedEnumValues ? enums.length > maxDisplayedEnumValues : false;

  const toggleButtonText = maxDisplayedEnumValues
    ? isCollapsed
      ? `+${enums.length - maxDisplayedEnumValues} ${translate('openapi.actions.more', 'more')}`
      : translate('openapi.actions.hide', 'Hide')
    : '';

  return (
    <>
      {isDescriptionEnum ? (
        <DescriptionEnums
          enums={displayedItems as DescriptionEnumProp}
          toggle={toggle}
          showToggleButton={showToggleButton}
          toggleButtonText={toggleButtonText}
          type={type}
          translate={translate}
        />
      ) : (
        <SimpleEnums
          enums={displayedItems as string[]}
          type={type}
          toggle={toggle}
          toggleButtonText={toggleButtonText}
          showToggleButton={showToggleButton}
          translate={translate}
        />
      )}
    </>
  );
}

export const EnumValues = memo<EnumValuesProps>(EnumValuesComponent);
