import * as React from 'react';
import { observer } from 'mobx-react';

import { OneOfButton, OneOfLabel, OneOfList } from '../../common-elements/schema';
import { SchemaProps, Schema } from './Schema';

@observer
export class OneOfSchema extends React.Component<SchemaProps> {
  render() {
    const { schema: { oneOf }, schema } = this.props;

    if (oneOf === undefined) {
      return null;
    }
    return (
      <div>
        <OneOfLabel> {schema.oneOfType} </OneOfLabel>
        <OneOfList>
          {oneOf.map((subSchema, idx) => (
            <OneOfButton
              key={subSchema._$ref}
              active={idx === schema.activeOneOf}
              onClick={() => schema.activateOneOf(idx)}
            >
              {subSchema.title || subSchema.displayType}
            </OneOfButton>
          ))}
        </OneOfList>
        <Schema schema={oneOf[schema.activeOneOf]} />
      </div>
    );
  }
}
