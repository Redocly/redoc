import { observer } from 'mobx-react';
import * as React from 'react';

import {
  OneOfButton as StyledOneOfButton,
  OneOfLabel,
  OneOfList,
} from '../../common-elements/schema';
import { Badge } from '../../common-elements/shelfs';
import { SchemaModel } from '../../services/models';
import { ConstraintsView } from '../Fields/FieldConstraints';
import { Schema, SchemaProps } from './Schema';

export interface OneOfButtonProps {
  subSchema: SchemaModel;
  idx: number;
  schema: SchemaModel;
}

@observer
export class OneOfButton extends React.Component<OneOfButtonProps> {
  render() {
    const { idx, schema, subSchema } = this.props;
    return (
      <StyledOneOfButton
        $deprecated={subSchema.deprecated}
        $active={idx === schema.activeOneOf}
        onClick={this.activateOneOf}
      >
        {subSchema.title || subSchema.typePrefix + subSchema.displayType}
      </StyledOneOfButton>
    );
  }

  activateOneOf = () => {
    this.props.schema.activateOneOf(this.props.idx);
  };
}

@observer
export class OneOfSchema extends React.Component<SchemaProps> {
  render() {
    const {
      schema: { oneOf },
      schema,
    } = this.props;

    if (oneOf === undefined) {
      return null;
    }
    const activeSchema = oneOf[schema.activeOneOf];

    return (
      <div>
        <OneOfLabel> {schema.oneOfType} </OneOfLabel>
        <OneOfList>
          {oneOf.map((subSchema, idx) => (
            <OneOfButton key={subSchema.pointer} schema={schema} subSchema={subSchema} idx={idx} />
          ))}
        </OneOfList>
        <div>
          {oneOf[schema.activeOneOf].deprecated && <Badge type="warning">Deprecated</Badge>}
        </div>
        <ConstraintsView constraints={activeSchema.constraints} />
        <Schema {...this.props} schema={activeSchema} />
      </div>
    );
  }
}
