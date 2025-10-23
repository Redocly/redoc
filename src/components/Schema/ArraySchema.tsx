import { memo, useCallback } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { SchemaProps } from './types.js';
import type { OpenAPISchema } from '../../types/index.js';

import { TypeName } from '../common/index.js';
import { Schema } from './Schema.js';
import { ObjectSchema } from './ObjectSchema.js';
import { humanizeConstraints } from '../../utils/index.js';
import { SubSchema } from './SubSchema.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { getExpandByDefault } from './helpers.js';
import { ArrayLabel, LabelValue, ArrayClosingLabel } from '../common/styled.js';

function ArraySchemaComponent({
  schema,
  schema: { minItems, maxItems, items: itemsSchema },
  fieldParentsName,
  ...rest
}: SchemaProps): ReactElement {
  const { schemasExpansionLevel } = useAtomValue(globalOptionsAtom);

  const parentSchemaTypes = Array.isArray(rest.parentType) ? rest.parentType : [rest.parentType];
  const isNestedArray = parentSchemaTypes.includes('array') && parentSchemaTypes.length === 1;
  const level = isNestedArray ? (rest.level || 0) + 1 : rest.level;
  const minMaxItems =
    minItems === undefined && maxItems === undefined
      ? ''
      : `(${humanizeConstraints(schema as OpenAPISchema)})`;

  let updatedParentsArray = fieldParentsName
    ? [...fieldParentsName.slice(0, -1), fieldParentsName[fieldParentsName.length - 1] + '[]']
    : fieldParentsName;

  const getFilteredFields = useCallback(
    (items) =>
      rest.skipReadOnly || rest.skipWriteOnly
        ? items?.filter(
            (item) =>
              !(
                (rest.skipReadOnly && item.schema.readOnly) ||
                (rest.skipWriteOnly && item.schema.writeOnly)
              ),
          )
        : items,
    [rest.skipReadOnly, rest.skipWriteOnly],
  );

  if (schema?.fields) {
    return (
      <ObjectSchema
        {...rest}
        shouldCloseArray={isNestedArray}
        level={level}
        schema={schema}
        fieldParentsName={updatedParentsArray}
        onOneOfChange={rest.onOneOfChange}
      />
    );
  }

  if (schema.displayType && !itemsSchema && !minMaxItems.length) {
    return (
      <div>
        <TypeName>{schema.displayType}</TypeName>
      </div>
    );
  }

  const filteredFields = getFilteredFields(itemsSchema?.fields);
  const filteredOneOfFields = getFilteredFields(itemsSchema?.oneOf?.[0]?.fields);

  const propertyLength = filteredFields?.length || filteredOneOfFields?.length;
  const isFirstLevel = rest.level === 1;
  const expandByDefault = getExpandByDefault({
    level: rest.level,
    required: rest.required,
    schemasExpansionLevel,
  });

  return (
    <SubSchema
      {...rest}
      propertyLength={propertyLength}
      isNestedArray={isNestedArray}
      level={level}
      isArray
      expandable={!isFirstLevel}
      expandByDefault={expandByDefault}
      operationPointer={schema.operationPointer}
    >
      <>
        {isFirstLevel && (
          <ArrayLabel>
            <LabelValue>Array [</LabelValue>
          </ArrayLabel>
        )}
        <Schema
          {...rest}
          parentType={!isFirstLevel ? schema.type : undefined}
          level={level}
          schema={itemsSchema}
          shouldCloseArray={isNestedArray}
          fieldParentsName={updatedParentsArray}
          expandable={false}
          onOneOfChange={rest.onOneOfChange}
        />
        {isFirstLevel && (
          <ArrayClosingLabel className="array-closing-label">
            <LabelValue>]</LabelValue>
          </ArrayClosingLabel>
        )}
      </>
    </SubSchema>
  );
}

export const ArraySchema = memo<SchemaProps>(ArraySchemaComponent);
