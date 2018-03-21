import * as React from 'react';

import {
  NullableLabel,
  PatternLabel,
  RecursiveLabel,
  TypeFormat,
  TypeName,
  TypePrefix,
  TypeTitle,
} from '../../common-elements/fields';
import { Markdown } from '../Markdown/Markdown';
import { EnumValues } from './EnumValues';
import { FieldProps } from './Field';
import { ConstraintsView } from './FieldContstraints';
import { FieldDetail } from './FieldDetail';

import { Badge } from '../../common-elements/';

export class FieldDetails extends React.PureComponent<FieldProps> {
  render() {
    const { showExamples, field, renderDiscriminatorSwitch } = this.props;

    const { schema, description, example, deprecated } = field;

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
          {schema.title && <TypeTitle> ({schema.title}) </TypeTitle>}
          <ConstraintsView constraints={schema.constraints} />
          {schema.nullable && <NullableLabel> Nullable </NullableLabel>}
          {schema.pattern && <PatternLabel>{schema.pattern}</PatternLabel>}
          {schema.isCircular && <RecursiveLabel> Recursive </RecursiveLabel>}
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
