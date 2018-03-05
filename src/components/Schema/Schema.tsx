import { observer } from 'mobx-react';
import * as React from 'react';

import { RecursiveLabel, TypeName, TypeTitle } from '../../common-elements/fields';
import { FieldDetails } from '../Fields/FieldDetails';

import { SchemaModel } from '../../services/models';

import { ArraySchema } from './ArraySchema';
import { ObjectSchema } from './ObjectSchema';
import { OneOfSchema } from './OneOfSchema';

export interface SchemaOptions {
  showTitle?: boolean;
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
}

export interface SchemaProps extends SchemaOptions {
  schema: SchemaModel;
}

@observer
export class Schema extends React.Component<Partial<SchemaProps>> {
  render() {
    const { schema } = this.props;
    if (!schema) {
      return <em> Schema not provided </em>;
    }
    const { type, oneOf, discriminatorProp, isCircular } = schema;

    if (isCircular) {
      return (
        <div>
          <TypeName>{schema.displayType}</TypeName>
          {schema.title && <TypeTitle> {schema.title} </TypeTitle>}
          <RecursiveLabel> Recursive </RecursiveLabel>
        </div>
      );
    }

    if (discriminatorProp !== undefined) {
      return (
        <ObjectSchema
          {...{ ...this.props, schema: oneOf![schema.activeOneOf] }}
          discriminator={{
            fieldName: discriminatorProp,
            parentSchema: schema,
          }}
        />
      );
    }

    if (oneOf !== undefined) {
      return <OneOfSchema schema={schema} {...this.props} />;
    }

    switch (type) {
      case 'object':
        return <ObjectSchema {...this.props as any} />;
      case 'array':
        return <ArraySchema {...this.props as any} />;
    }

    // TODO: maybe adjust FieldDetails to accept schema
    return (
      <div>
        <FieldDetails
          field={{
            schema,
            name: '',
            required: false,
            description: schema.description,
            deprecated: false,
            toggle: () => null,
            expanded: false,
          }}
        />
      </div>
    );
  }
}
