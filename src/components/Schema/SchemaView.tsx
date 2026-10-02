import { memo, useContext } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { PropertyType, SchemaNode, Document } from '../../types/schema.js';
import type { OpenAPISchema } from '../../types/openapi.js';
import type { AsyncAPISchema } from '../../types/asyncapi.js';
import type { PropertyRendererProps } from './views/PropertyRenderer.js';
import type { OneOfChangeParams } from '../../types/pluggable.js';

import { schemaEntryAtom } from '../../jotai/schema.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { useSchemaDocument } from './hooks/useSchemaDocument.js';
import { buildSchemaFieldSuffix } from './hooks/useSchemaFieldDeepLink.js';
import { PropertyRenderer } from './views/PropertyRenderer.js';
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

const processedSchemaMap = new WeakMap<SchemaNode, PropertyType>();

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

  const resolvedSchema = (directSchema ?? entry?.data) as SchemaNode | undefined;
  let property: PropertyType | undefined;
  if (resolvedSchema) {
    // The shared cache is keyed only by schema identity, so it can't be used
    // when a custom example serializer changes the output.
    if (!exampleSerializer && processedSchemaMap.has(resolvedSchema)) {
      property = processedSchemaMap.get(resolvedSchema);
    } else {
      property = processSchema(resolvedSchema, document as Document, {
        rootJsonPointer: resolvedRootPointer,
        exampleSerializer,
        sortRequiredPropsFirst,
      }) as PropertyType | undefined;
      if (property && !exampleSerializer) {
        processedSchemaMap.set(resolvedSchema, property);
      }
    }
  }

  useExpandableSection(expandableSectionKey, Boolean(property?.isExpandable));

  if (!property) {
    return <></>;
  }

  return (
    <PropertyRenderer
      property={property}
      level={level}
      expandByDefault={expandByDefault}
      skipReadOnly={skipReadOnly}
      skipWriteOnly={skipWriteOnly}
      onOneOfChange={onOneOfChange}
    />
  );
}

export const SchemaView = memo(SchemaViewComponent);
