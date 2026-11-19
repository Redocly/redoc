import { memo, useContext, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { SchemaNode, Document, OneOfChangeParams } from '../../types/schema.js';
import type { OpenAPISchema } from '../../types/openapi.js';
import type { AsyncAPISchema } from '../../types/asyncapi.js';
import type { PropertyRendererProps } from './views/PropertyRenderer.js';

import { isSchemaNode } from '../../types/schema.js';
import { schemaEntryAtom } from '../../jotai/schema.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { useSchemaDocument } from './hooks/useSchemaDocument.js';
import { buildSchemaFieldSuffix } from './hooks/useSchemaFieldDeepLink.js';
import { PropertyRenderer, printsOwnDescription } from './views/PropertyRenderer.js';
import { SchemaDescription } from './SchemaDescription.js';
import { processSchema } from '../../services/schema/index.js';
import { DeepLinkSectionContext } from '../../hooks/useDeepLinkSection.js';
import { useExpandableSection } from '../../hooks/useExpandableSection.js';

type SharedRendererProps = Pick<
  PropertyRendererProps,
  'level' | 'expandByDefault' | 'skipReadOnly' | 'skipWriteOnly' | 'onOneOfChange'
>;

export interface SchemaViewProps extends Partial<SharedRendererProps> {
  schemaId?: string;
  schema?: OpenAPISchema | AsyncAPISchema;
  level?: number;
  expandByDefault?: boolean;
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
  rootJsonPointer?: string;
  exampleSerializer?: (value: unknown) => string;
}

// The `true` schema allows any value, like an empty one.
const ANY_SCHEMA: SchemaNode = {};

function SchemaViewComponent({
  schemaId,
  schema: directSchema,
  level = 1,
  expandByDefault,
  skipReadOnly,
  skipWriteOnly,
  onOneOfChange,
  rootJsonPointer,
  exampleSerializer,
}: SchemaViewProps): ReactElement {
  const entry = useAtomValue(schemaEntryAtom(schemaId ?? ''));
  const { sortRequiredPropsFirst } = useAtomValue(globalOptionsAtom);
  const document = useSchemaDocument();
  const sectionCtx = useContext(DeepLinkSectionContext);
  const expandableSectionKey = buildSchemaFieldSuffix(sectionCtx, '');

  const resolvedRootPointer = rootJsonPointer ?? (schemaId ? `#/${schemaId}` : '#');

  const rawSchema: unknown = directSchema ?? entry?.booleanSchema ?? entry?.data;
  let resolvedSchema: SchemaNode | undefined;
  if (rawSchema === true) resolvedSchema = ANY_SCHEMA;
  else if (isSchemaNode(rawSchema)) resolvedSchema = rawSchema;
  const property = useMemo(
    () =>
      resolvedSchema
        ? processSchema(resolvedSchema, document as Document, {
            rootJsonPointer: resolvedRootPointer,
            exampleSerializer,
            sortRequiredPropsFirst,
          })
        : undefined,
    [resolvedSchema, document, resolvedRootPointer, exampleSerializer, sortRequiredPropsFirst],
  );

  useExpandableSection(expandableSectionKey, Boolean(property?.isExpandable));

  if (!property) {
    return <></>;
  }

  return (
    <>
      {printsOwnDescription(property) ? null : <SchemaDescription value={property.description} />}
      <PropertyRenderer
        property={property}
        level={level}
        expandByDefault={expandByDefault}
        skipReadOnly={skipReadOnly}
        skipWriteOnly={skipWriteOnly}
        onOneOfChange={onOneOfChange}
      />
    </>
  );
}

export const SchemaView = memo(SchemaViewComponent);
