import * as React from 'react';
import { observer } from 'mobx-react';

import { FieldDetails } from '../Fields/FieldDetails';
import { TypeName, CircularLabel } from '../../common-elements/fields';

import { SchemaModel } from '../../services/models';

import { ObjectSchema } from './ObjectSchema';
import { OneOfSchema } from './OneOfSchema';
import { ArraySchema } from './ArraySchema';

export interface SchemaProps {
  schema: SchemaModel;
  showTitle?: boolean;
}

@observer
export class Schema extends React.Component<Partial<SchemaProps>> {
  render() {
    const { schema } = this.props;
    if (!schema) return <em> Schema not provided </em>;
    const { type, oneOf, discriminatorProp, isCircular } = schema;

    if (isCircular) {
      return (
        <div>
          <TypeName>{schema.displayType}</TypeName>
          <CircularLabel> Circular </CircularLabel>
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
      return <OneOfSchema schema={schema} />;
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
