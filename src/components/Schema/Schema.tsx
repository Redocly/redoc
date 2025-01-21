import { observer } from 'mobx-react';
import * as React from 'react';

import { FieldDetails } from '../Fields/FieldDetails';

import { FieldModel, SchemaModel } from '../../services/models';

import { ArraySchema } from './ArraySchema';
import { ObjectSchema } from './ObjectSchema';
import { OneOfSchema } from './OneOfSchema';
import { RecursiveSchema } from './RecursiveSchema';

import { isArray } from '../../utils/helpers';

export interface SchemaOptions {
  showTitle?: boolean;
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  level?: number;
}

export interface SchemaProps extends SchemaOptions {
  schema: SchemaModel;
  fieldParentsName?: string[];
}

@observer
export class Schema extends React.Component<Partial<SchemaProps>> {
  render() {
    const { schema, ...rest } = this.props;
    const level = (rest.level || 0) + 1;

    if (!schema) {
      return <em> Schema not provided </em>;
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
      const activeSchema = oneOf[schema.activeOneOf];
      return activeSchema.isCircular ? (
        <RecursiveSchema schema={activeSchema} />
      ) : (
        <ObjectSchema
          {...rest}
          level={level}
          schema={activeSchema}
          discriminator={{
            fieldName: discriminatorProp,
            parentSchema: schema,
          }}
        />
      );
    }

    if (oneOf !== undefined) {
      return <OneOfSchema schema={schema} {...rest} />;
    }

    const types = isArray(type) ? type : [type];
    if (types.includes('object')) {
      if (schema.fields?.length) {
        return <ObjectSchema {...(this.props as any)} level={level} />;
      }
    } else if (types.includes('array')) {
      return <ArraySchema {...(this.props as any)} level={level} />;
    }

    // TODO: maybe adjust FieldDetails to accept schema
    const field = {
      schema,
      name: '',
      required: false,
      description: schema.description,
      externalDocs: schema.externalDocs,
      deprecated: false,
      toggle: () => null,
      expanded: false,
    } as any as FieldModel; // cast needed for hot-loader to not fail

    return (
      <div>
        <FieldDetails field={field} />
      </div>
    );
  }
}
