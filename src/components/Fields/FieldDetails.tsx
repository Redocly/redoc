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
import { OptionsContext } from '../OptionsProvider';

const MAX_PATTERN_LENGTH = 45;

export class FieldDetails extends React.PureComponent<FieldProps> {
  static contextType = OptionsContext;
  render() {
    const { showExamples, field, renderDiscriminatorSwitch } = this.props;
    const { enumSkipQuotes, hideSchemaTitles } = this.context;

    const { schema, description, example, deprecated } = field;

    const rawDefault = !!enumSkipQuotes || field.in === 'header'; // having quotes around header field default values is confusing and inappropriate

    let exampleField: JSX.Element | null = null;

    if (showExamples && example !== undefined) {
      const label = l('example') + ':';
      if (field.in && (field.style || field.serializationMime)) {
        // decode for better readability in examples: see https://github.com/Redocly/redoc/issues/1138
        const serializedValue = decodeURIComponent(serializeParameterValue(field, example));
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
          {schema.title && !hideSchemaTitles && <TypeTitle> ({schema.title}) </TypeTitle>}
          <ConstraintsView constraints={schema.constraints} />
          {schema.nullable && <NullableLabel> {l('nullable')} </NullableLabel>}
          {schema.pattern && schema.pattern.length < MAX_PATTERN_LENGTH && (
            <PatternLabel> {schema.pattern} </PatternLabel>
          )}
          {schema.isCircular && <RecursiveLabel> {l('recursive')} </RecursiveLabel>}
        </div>
        {deprecated && (
          <div>
            <Badge type="warning"> {l('deprecated')} </Badge>
          </div>
        )}
        <FieldDetail raw={rawDefault} label={l('default') + ':'} value={schema.default} />
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
