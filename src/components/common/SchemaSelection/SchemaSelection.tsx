import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';

import type { SegmentedOption } from '@redocly/theme/core/openapi';
import type { SchemaModel } from '../../../models/index.js';

import { isUndefined } from '@redocly/theme/core/openapi';
import { Segmented } from '@redocly/theme/components/Segmented/Segmented';

import { Dropdown } from '../Dropdown/index.js';
import { operationStore } from '../../../jotai/operation.js';

const LIMIT_FOR_SEGMENTED = 5;
const ENABLE_SEARCH_THRESHOLD = 7;

interface SchemaSelectionProps {
  options: SegmentedOption<number>[];
  onChange?: (idx: number) => void;
  pointer: string;
  schema: SchemaModel;
  defaultOneOfIdx: number;
}

function SchemaSelectionComponent({
  options,
  onChange,
  pointer,
  schema,
  defaultOneOfIdx,
}: SchemaSelectionProps) {
  const [store, setOperationStore] = useAtom(operationStore(pointer));

  const activeOneOfIdx = store.activeOneOf[schema.pointer] ?? defaultOneOfIdx;
  const activeValue = options[activeOneOfIdx]?.value;

  const [isAnyItemTruncated, setIsAnyItemTruncated] = useState(false);
  const segmentedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!segmentedRef.current) return;

    const checkTruncation = () => {
      const items = segmentedRef.current?.querySelectorAll('button[role="tab"]');
      const isTruncated = Array.from(items || []).some((item) => {
        return (item as HTMLElement).offsetWidth < (item as HTMLElement).scrollWidth;
      });

      if (isTruncated !== isAnyItemTruncated) {
        setIsAnyItemTruncated(isTruncated);
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);

    return () => window.removeEventListener('resize', checkTruncation);
  }, [isAnyItemTruncated, options]);

  const handleSelectedChange = useCallback(
    ({ value }): void => {
      if (value !== undefined) {
        if (onChange) {
          onChange(value);
        } else {
          setOperationStore({
            activeExampleName: schema.oneOf?.[value]?.title,
            activeOneOf: { [schema.pointer]: value },
            requestValues: { body: null },
          });
        }
      }
    },
    [onChange, schema.oneOf, schema.pointer, setOperationStore],
  );

  if (isUndefined(activeValue)) {
    return null;
  }

  return options.length > LIMIT_FOR_SEGMENTED || isAnyItemTruncated ? (
    <Dropdown
      options={options}
      value={activeValue}
      withSearch={options.length >= ENABLE_SEARCH_THRESHOLD}
      onChange={handleSelectedChange}
    />
  ) : (
    <Segmented
      ref={segmentedRef}
      value={activeValue}
      onChange={handleSelectedChange}
      options={options}
      size="small"
      data-testid="segmented-schema"
    />
  );
}

export const SchemaSelection = SchemaSelectionComponent;
