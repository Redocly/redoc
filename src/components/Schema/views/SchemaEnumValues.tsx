import { memo, useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';

import { globalOptionsAtom } from '../../../jotai/store.js';
import { EnumExpandToggle, EnumRow, EnumValue, FieldDetailLabel } from '../styled.js';
import { getEnumDisplaySlice } from '../utils.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

type SchemaEnumValuesProps = {
  label: string;
  values: unknown[];
};

function SchemaEnumValuesComponent({ label, values }: SchemaEnumValuesProps): ReactElement | null {
  const options = useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();
  const maxDisplayedEnumValues =
    'maxDisplayedEnumValues' in options ? options.maxDisplayedEnumValues : undefined;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggle = useCallback(() => setIsCollapsed((c) => !c), []);

  const { displayed, showToggle } = useMemo(
    () => getEnumDisplaySlice(values, maxDisplayedEnumValues, isCollapsed),
    [values, maxDisplayedEnumValues, isCollapsed],
  );

  if (!values.length) {
    return null;
  }

  const limit =
    typeof maxDisplayedEnumValues === 'number' && maxDisplayedEnumValues > 0
      ? maxDisplayedEnumValues
      : 0;

  const toggleLabel = isCollapsed
    ? `+${values.length - limit} ${translate('actions.more', 'more')}`
    : translate('actions.hide', 'Hide');

  return (
    <EnumRow data-testid="schema-enum-values">
      <FieldDetailLabel>{label}</FieldDetailLabel>
      {displayed.map((value, index) => (
        <EnumValue key={`${JSON.stringify(value)}-${index}`}>{JSON.stringify(value)}</EnumValue>
      ))}
      {showToggle && (
        <EnumExpandToggle type="button" onClick={toggle}>
          {toggleLabel}
        </EnumExpandToggle>
      )}
    </EnumRow>
  );
}

export const SchemaEnumValues = memo(SchemaEnumValuesComponent);
