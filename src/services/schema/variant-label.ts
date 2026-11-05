import type { SchemaNode } from '../../types/schema.js';

import { buildDisplayType, schemaType, stringifyValue } from './propertyBuilder.js';

export type VariantLabel = {
  label: string;
  typeLabel: string;
};

export function deriveVariantLabel(variant: SchemaNode, parentSchema: SchemaNode): VariantLabel {
  const variantMergedWithParent =
    (variant as unknown) === false ? variant : { type: parentSchema.type, ...variant };
  const varType = schemaType(variantMergedWithParent);
  const { typePrefix, displayType, displayFormat } = buildDisplayType(
    variantMergedWithParent,
    varType,
  );
  let typeLabel = `${typePrefix}${displayType}`;
  if (displayFormat) typeLabel += ` (${displayFormat})`;
  const label =
    variant.title ||
    variant['x-original-ref']?.split('/').pop() ||
    (variant.const !== undefined ? stringifyValue(variant.const) : undefined) ||
    typeLabel;
  return { label, typeLabel };
}
