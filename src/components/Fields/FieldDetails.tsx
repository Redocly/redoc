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
import { serializeParameterValue } from '../../utils/openapi';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Markdown } from '../Markdown/Markdown';
import { EnumValues } from './EnumValues';
import { Extensions } from './Extensions';
import { FieldProps } from './Field';
import { ConstraintsView } from './FieldContstraints';
import { FieldDetail } from './FieldDetail';

import { Badge } from '../../common-elements/';

import { l } from '../../services/Labels';

export class FieldDetails extends React.PureComponent<FieldProps> {
  render() {
    const { showExamples, field, renderDiscriminatorSwitch } = this.props;

    const { schema, description, example, deprecated } = field;

    let exampleField: JSX.Element | null = null;

    if (showExamples) {
      const label = l('example') + ':';
      if (field.in && field.style) {
        const serializedValue =
          example !== undefined ? serializeParameterValue(field, example) : undefined;
        exampleField = <FieldDetail label={label} value={serializedValue} raw={true} />;
      } else {
        exampleField = <FieldDetail label={label} value={example} />;
      }
    }

    return (
      <div>
        <div>
          <TypePrefix>{schema.typePrefix}</TypePrefix>
          <TypeName>{schema.displayType}</TypeName>
          {schema.displayFormat && (
            <TypeFormat>
              {' '}
              &lt;
              {schema.displayFormat}
              &gt;{' '}
            </TypeFormat>
          )}
          {schema.title && <TypeTitle> ({schema.title}) </TypeTitle>}
          <ConstraintsView constraints={schema.constraints} />
          {schema.nullable && <NullableLabel> {l('nullable')} </NullableLabel>}
          {schema.pattern && <PatternLabel>{schema.pattern}</PatternLabel>}
          {schema.isCircular && <RecursiveLabel> {l('recursive')} </RecursiveLabel>}
        </div>
        {deprecated && (
          <div>
            <Badge type="warning"> {l('deprecated')} </Badge>
          </div>
        )}
        <FieldDetail label={l('default') + ':'} value={schema.default} />
        {!renderDiscriminatorSwitch && <EnumValues type={schema.type} values={schema.enum} />}{' '}
        {exampleField}
        {<Extensions extensions={{ ...field.extensions, ...schema.extensions }} />}
        <div>
          <Markdown compact={true} source={description} />
        </div>
        {schema.externalDocs && (
          <ExternalDocumentation externalDocs={schema.externalDocs} compact={true} />
        )}
        {(renderDiscriminatorSwitch && renderDiscriminatorSwitch(this.props)) || null}
      </div>
    );
  }
}
