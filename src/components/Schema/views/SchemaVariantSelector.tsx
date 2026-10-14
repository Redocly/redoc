import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';

import type { SegmentedOption } from '@redocly/theme/core/openapi';
import type { SwitcherOptionType } from '../../../types/schema.js';

import { isUndefined } from '@redocly/theme/core/openapi';
import { Segmented } from '@redocly/theme/components/Segmented/Segmented';

import { strikethroughText } from '../../../utils/string.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { VariantOptionDivider } from '../styled.js';
import { DefaultMappingOptionLabel } from './DefaultMappingOptionLabel.js';
import { VariantDropdown } from './VariantDropdown.js';

type SchemaVariantOptionEntry = [string, SwitcherOptionType];

const DEFAULT_MAPPING_LABEL = 'Default mapping';

function formatVariantLabel(displayKey: string, opt: SwitcherOptionType): string {
  if (opt.isDeprecated) {
    return `${strikethroughText(displayKey)} (deprecated)`;
  }
  return displayKey;
}

function buildVariantSegmentedOptions(
  entries: SchemaVariantOptionEntry[],
  defaultMappingLabel: string,
): SegmentedOption<number>[] {
  const total = entries.length;

  return entries.map(([key, opt], idx) => {
    if (opt.isDefaultMapping) {
      return {
        label: defaultMappingLabel,
        value: idx,
        element: <DefaultMappingOptionLabel label={defaultMappingLabel} />,
        ...(total > 1 ? { divider: <VariantOptionDivider /> } : {}),
      };
    }

    return { label: formatVariantLabel(key, opt), value: idx };
  });
}

const SCHEMA_VARIANT_SEGMENTED_LIMIT = 5;

type SchemaVariantSelectorProps = {
  optionEntries: SchemaVariantOptionEntry[];
  activeIndex: number;
  onChange: (index: number) => void;
  'data-testid'?: string;
};

export function SchemaVariantSelector({
  optionEntries,
  activeIndex,
  onChange,
  'data-testid': dataTestId = 'segmented-schema',
}: SchemaVariantSelectorProps): ReactElement | null {
  const translate = useSpecTranslate();
  const defaultMappingLabel = translate('discriminator.defaultMapping', DEFAULT_MAPPING_LABEL);
  const options = useMemo(
    () => buildVariantSegmentedOptions(optionEntries, defaultMappingLabel),
    [optionEntries, defaultMappingLabel],
  );
  const optionsSignature = useMemo(
    () =>
      optionEntries
        .map(
          ([key, opt]) =>
            `${key}|${opt.isDefaultMapping ? 'default' : 'regular'}|${opt.isDeprecated ? 'deprecated' : 'active'}`,
        )
        .join('||'),
    [optionEntries],
  );

  const activeValue = options[activeIndex]?.value;

  const [isAnyItemTruncated, setIsAnyItemTruncated] = useState(false);
  const segmentedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAnyItemTruncated(false);
  }, [optionsSignature]);

  useEffect(() => {
    if (optionEntries.length > SCHEMA_VARIANT_SEGMENTED_LIMIT) {
      setIsAnyItemTruncated(false);
      return;
    }

    if (!segmentedRef.current) {
      return;
    }

    const checkTruncation = (): void => {
      const items = segmentedRef.current?.querySelectorAll('button[role="tab"]');
      const isTruncated = Array.from(items ?? []).some((item) => {
        const el = item as HTMLElement;
        return el.offsetWidth < el.scrollWidth;
      });

      setIsAnyItemTruncated((prev) => (isTruncated !== prev ? isTruncated : prev));
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);

    return () => window.removeEventListener('resize', checkTruncation);
  }, [isAnyItemTruncated, optionEntries.length, optionsSignature]);

  const handleOptionChange = useCallback(
    (opt: SegmentedOption<number>): void => {
      if (opt.value !== undefined) {
        onChange(opt.value);
      }
    },
    [onChange],
  );

  if (isUndefined(activeValue)) {
    return null;
  }

  return options.length > SCHEMA_VARIANT_SEGMENTED_LIMIT || isAnyItemTruncated ? (
    <VariantDropdown options={options} value={activeValue} onChange={handleOptionChange} />
  ) : (
    <Segmented
      ref={segmentedRef}
      value={activeValue}
      onChange={handleOptionChange}
      options={options}
      size="small"
      data-testid={dataTestId}
    />
  );
}
