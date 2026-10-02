import type { OperationParameter } from '@redocly/theme/core/openapi';
import type { SchemaEntry } from '../../../../types/store.js';
import type { SchemaNode } from '../../../../types/schema.js';
import type { ExtractContext } from './context.js';

import { schemaKind } from '../../../../types/common.js';
import { SCHEMA_FIELDS_PLACE } from '../places.js';
import { describe } from './context.js';

type SchemaPageFields = { parameters: OperationParameter[]; description: string };

export function extractSchemaPageFields(
  schemaName: string,
  schemaStore: Record<string, SchemaEntry> | undefined,
  ctx: ExtractContext,
): SchemaPageFields {
  const schemaId = `components/schemas/${schemaName}`;
  const entry = schemaStore?.[schemaId];
  if (!entry || entry.kind !== schemaKind.JSON_SCHEMA) {
    return { parameters: [], description: '' };
  }

  const paramsMap: Record<string, OperationParameter> = {};
  ctx.walker.extractSchemaFields(
    { schemaId, place: SCHEMA_FIELDS_PLACE, paramsMap, slug: ctx.slug },
    { pathOnly: true },
  );

  const schema = ctx.walker.resolveEffectiveSchema(entry.data as SchemaNode);
  return { parameters: Object.values(paramsMap), description: describe(ctx, schema.description) };
}
