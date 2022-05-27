import { observer } from 'mobx-react';
import * as React from 'react';

import {
  OneOfButton as StyledOneOfButton,
  OneOfLabel,
  OneOfList,
} from '../../common-elements/schema';
import { Badge } from '../../common-elements/shelfs';
import { SchemaModel } from '../../services/models';
import { ConstraintsView } from '../Fields/FieldContstraints';
import { Schema, SchemaProps } from './Schema';

interface DiscriminatorProps {
  discriminatorValue: number;
  onChangeDiscriminator(nextDiscriminatorValue: number): void;
}

export interface OneOfButtonProps extends DiscriminatorProps {
  subSchema: SchemaModel;
  idx: number;
  schema: SchemaModel;
}

@observer
export class OneOfButton extends React.Component<OneOfButtonProps> {
  render() {
    const { idx, discriminatorValue, subSchema } = this.props;
    return (
      <StyledOneOfButton
        deprecated={subSchema.deprecated}
        active={idx === discriminatorValue}
        onClick={this.activateOneOf}
      >
        {subSchema.title || subSchema.typePrefix + subSchema.displayType}
      </StyledOneOfButton>
    );
  }

  activateOneOf = () => {
    this.props.onChangeDiscriminator(this.props.idx);
  };
}

@observer
export class OneOfSchema extends React.Component<SchemaProps & DiscriminatorProps> {
  render() {
    const {
      schema: { oneOf },
      schema,
      discriminatorValue,
      onChangeDiscriminator,
    } = this.props;

    if (oneOf === undefined) {
      return null;
    }
    const activeSchema = oneOf[discriminatorValue];

    return (
      <div>
        <OneOfLabel> {schema.oneOfType} </OneOfLabel>
        <OneOfList>
          {oneOf.map((subSchema, idx) => (
            <OneOfButton
              key={subSchema.pointer}
              schema={schema}
              subSchema={subSchema}
              idx={idx}
              discriminatorValue={discriminatorValue}
              onChangeDiscriminator={onChangeDiscriminator}
            />
          ))}
        </OneOfList>
        <div>
          {oneOf[discriminatorValue].deprecated && <Badge type="warning">Deprecated</Badge>}
        </div>
        <ConstraintsView constraints={activeSchema.constraints} />
        <Schema {...this.props} schema={activeSchema} />
      </div>
    );
  }
}
