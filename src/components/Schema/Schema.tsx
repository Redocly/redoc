import { memo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { FieldModel, SchemaModel } from '../../models/index.js';
import type { SchemaProps } from './types.js';

import { ArraySchema } from './ArraySchema.js';
import { ObjectSchema } from './ObjectSchema.js';
import { OneOfSchema } from './OneOfSchema.js';
import { RecursiveSchema } from './RecursiveSchema.js';
import { operationStore } from '../../jotai/operation.js';
import { FieldDetails } from '../PropertyDetails/index.js';
import { pathIncludesLink } from '../../utils/index.js';
import { styled } from '../../styled-components.js';
import { useLocation } from '../../hooks/useLocation.js';

function SchemaComponent({
  schema,
  onDiscriminatorChange,
  onOneOfChange,
  ...rest
}: Partial<SchemaProps>): ReactElement | null {
  const { activeOneOf } = useAtomValue(operationStore(schema?.operationPointer || ''));
  const location = useLocation();

  if (!schema) {
    return null;
  }

  const { type, oneOf, discriminatorProp, isCircular } = schema;

  if (isCircular) {
    return <RecursiveSchema schema={schema} />;
  }

  if (discriminatorProp !== undefined) {
    if (!oneOf || !oneOf.length) {
      console.warn(
        `Looks like you are using discriminator wrong: you don't have any definition inherited from the ${schema.title}`,
      );
      return null;
    }

    const locationOneOfIdx = oneOf.findIndex((_, index) =>
      pathIncludesLink(location, `d=${index}`),
    );
    const activeOneOfIdx = locationOneOfIdx === -1 ? 0 : locationOneOfIdx;
    const activeSchemaIndex =
      activeOneOf[schema.pointer] !== undefined ? activeOneOf[schema.pointer] : activeOneOfIdx;
    const activeSchema = oneOf[activeSchemaIndex];

    return activeSchema?.isCircular ? (
      <RecursiveSchema schema={activeSchema} />
    ) : (
      <ObjectSchema
        {...rest}
        schema={activeSchema}
        discriminator={{
          fieldName: discriminatorProp,
          parentSchema: schema,
          activeOneOfIdx: activeOneOfIdx,
          onChange: onDiscriminatorChange,
        }}
        onOneOfChange={onOneOfChange}
      />
    );
  }

  if (oneOf !== undefined && oneOf.length > 1) {
    return (
      <OneOfSchema
        {...rest}
        schema={schema as SchemaModel & { oneOf: SchemaModel[] }}
        onChange={onOneOfChange}
      />
    );
  }

  const types = Array.isArray(type) ? type : [type];
  if (types.includes('object')) {
    if (schema.fields?.length) {
      return <ObjectSchema {...rest} schema={schema} onOneOfChange={onOneOfChange} />;
    }
  } else if (types.includes('array')) {
    return <ArraySchema {...rest} schema={schema} onOneOfChange={onOneOfChange} />;
  }

  const field = {
    schema,
    name: '',
    description: schema.description,
    required: false,
    deprecated: false,
  } as FieldModel;

  return (
    <Wrapper>
      <FieldDetails field={field} fieldParentsName={rest.fieldParentsName} />
    </Wrapper>
  );
}

export const Schema = memo<Partial<SchemaProps>>(SchemaComponent);

const Wrapper = styled.div`
  width: 100%;
  padding: var(--spacing-xxs) 0;
  border-bottom: 1px solid var(--border-color-primary);
`;
