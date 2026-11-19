import type { Node } from '@redocly/markdoc';
import type { PropertyType } from '../../types/schema.js';

import { ARRAY_TYPE_PREFIX } from '../../types/schema.js';

const LEVEL_COLORS = [
  'var(--color-purple-7)',
  'var(--color-blueberry-7)',
  'var(--color-blue-8)',
  'var(--color-turquoise-8)',
  'var(--color-green-8)',
  'var(--color-grass-8)',
  'var(--color-carrot-8)',
  'var(--color-orange-7)',
  'var(--color-magenta-7)',
];

export function cycleColorsByLevel(level?: number): string | undefined {
  if (level === undefined) return undefined;
  const index = level % LEVEL_COLORS.length;
  return `var(--schema-nested-level-${index}-color, ${LEVEL_COLORS[index]})`;
}

export function getSchemaEnumRowLabel(
  propertyType: string | undefined,
  valueCount: number,
): string {
  const prefix = propertyType?.startsWith(ARRAY_TYPE_PREFIX) ? 'Items ' : '';
  return `${prefix}${valueCount === 1 ? 'Value:' : 'Enum:'}`;
}

export type DiscriminatorEnumRender = {
  isDescriptionEnum: boolean;
  enumDescriptions?: Record<string, string | Node | Node[]>;
  enumValues: unknown[];
};

export function getDiscriminatorEnumRender(prop: PropertyType): DiscriminatorEnumRender {
  const propEnum = prop.enum;
  const enumDescriptions = propEnum && !Array.isArray(propEnum) ? propEnum : undefined;
  return {
    isDescriptionEnum: Boolean(enumDescriptions),
    enumDescriptions,
    enumValues: Array.isArray(propEnum) ? propEnum : [],
  };
}

export function getEnumDisplaySlice(
  values: unknown[],
  maxDisplayedEnumValues: number | undefined,
  isCollapsed: boolean,
): { displayed: unknown[]; showToggle: boolean } {
  const limit =
    typeof maxDisplayedEnumValues === 'number' && maxDisplayedEnumValues > 0
      ? maxDisplayedEnumValues
      : 0;
  const exceedsLimit = limit > 0 && values.length > limit;
  const displayed = exceedsLimit && isCollapsed ? values.slice(0, limit) : values;
  return { displayed, showToggle: exceedsLimit };
}
