import type { Node } from '@markdoc/markdoc';
import type { PropertyType } from '../../types/schema.js';

export type PropertyEnumModel =
  | { kind: 'none' }
  | { kind: 'descriptions'; record: Record<string, string | Node | Node[]> }
  | { kind: 'values'; list: string[] };

export function getPropertyEnumModel(enumValues: PropertyType['enum']): PropertyEnumModel {
  if (!enumValues) return { kind: 'none' };
  if (!Array.isArray(enumValues)) return { kind: 'descriptions', record: enumValues };
  if (enumValues.length === 0) return { kind: 'none' };
  return { kind: 'values', list: enumValues };
}

export function splitObjectTypeConstraints(typeLine: string): string[] {
  const trimmed = typeLine.replace(/^object\s*/, '').trim();
  if (!trimmed) return [];
  return trimmed.split(/(?<!\s)\s+(?=[[><=])/).filter(Boolean);
}

export const LEVEL_COLORS = [
  '#9D00FF',
  '#615CEA',
  '#147DF5',
  '#08BFCC',
  '#08CC7A',
  '#81CC08',
  '#E5BE00',
  '#FF8700',
  '#FF00B8',
];

export function cycleColorsByLevel(level?: number): string | undefined {
  if (level === undefined) return undefined;
  return LEVEL_COLORS[level % LEVEL_COLORS.length];
}

export function getSchemaEnumRowLabel(
  propertyType: string | undefined,
  valueCount: number,
): string {
  const prefix = propertyType?.startsWith('Array') ? 'Items ' : '';
  return `${prefix}${valueCount === 1 ? 'Value:' : 'Enum:'}`;
}

export type DiscriminatorEnumRender = {
  isDescriptionEnum: boolean;
  enumDescriptions?: Record<string, string | Node | Node[]>;
  enumValues: unknown[];
};

export function getDiscriminatorEnumRender(
  prop: PropertyType,
  mappingKeys: string[],
): DiscriminatorEnumRender {
  const propEnum = prop.enum;
  const enumDescriptions = propEnum && !Array.isArray(propEnum) ? propEnum : undefined;
  const propEnumArray = propEnum && Array.isArray(propEnum) ? propEnum : undefined;
  const enumValues: unknown[] =
    propEnumArray && propEnumArray.length > 0 ? propEnumArray : mappingKeys;
  return {
    isDescriptionEnum: Boolean(enumDescriptions),
    enumDescriptions,
    enumValues,
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
