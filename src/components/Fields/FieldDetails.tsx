import * as React from 'react';

import { FieldProps } from './Field';
import { Markdown } from '../Markdown/Markdown';
import { EnumValues } from './EnumValues';
import { FieldDetail } from './FieldDetail';
import { ConstraintsView } from './FieldContstraints';
import {
  CircularLabel,
  NullableLabel,
  PatternLabel,
  RequiredLabel,
  TypeFormat,
  TypeName,
  TypePrefix,
} from '../../common-elements/fields';

import { Badge } from '../../common-elements/';

export class FieldDetails extends React.PureComponent<FieldProps> {
  render() {
    const { showExamples, field, renderDiscriminatorSwitch } = this.props;

    const { schema, description, required, example, deprecated } = field;

    return (
      <div>
        <div>
          <TypePrefix>{schema.typePrefix}</TypePrefix>
          <TypeName>{schema.displayType}</TypeName>
          {schema.format && (
            <TypeFormat>
              {' <'}
              {schema.format}>
            </TypeFormat>
          )}
          <ConstraintsView constraints={schema.constraints} />
          {schema.nullable && <NullableLabel> Nullable </NullableLabel>}
          {schema.pattern && <PatternLabel>{schema.pattern}</PatternLabel>}
          {required && <RequiredLabel> Required </RequiredLabel>}
          {schema.isCircular && <CircularLabel> Circular </CircularLabel>}
        </div>
        {deprecated && (
          <div>
            <Badge type="warning"> Deprecated </Badge>
          </div>
        )}
        <FieldDetail label={'Default:'} value={schema.default} />
        {!renderDiscriminatorSwitch && <EnumValues type={schema.type} values={schema.enum} />}{' '}
        {showExamples && <FieldDetail label={'Example:'} value={example} />}
        <div>
          <Markdown dense={true} source={description} />
        </div>
        {(renderDiscriminatorSwitch && renderDiscriminatorSwitch(this.props)) || null}
      </div>
    );
  }
}
