import * as React from 'react';

import {
  RecursiveLabel,
  TypeFormat,
  TypeName,
  TypePrefix,
  TypeTitle,
} from '../../common-elements/fields';
import { getSerializedValue } from '../../utils';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Markdown } from '../Markdown/Markdown';
import { EnumValues } from './EnumValues';
import { Extensions } from './Extensions';
import { FieldProps } from './Field';
import { Examples } from './Examples';
import { ConstraintsView } from './FieldContstraints';
import { FieldDetail } from './FieldDetail';

import { Badge } from '../../common-elements/';

import { l } from '../../services/Labels';
import { OptionsContext } from '../OptionsProvider';
import { Pattern } from './Pattern';
import { ArrayItemDetails } from './ArrayItemDetails';

export class FieldDetails extends React.PureComponent<FieldProps, { patternShown: boolean }> {
  static contextType = OptionsContext;

  render() {
    const { showExamples, field, renderDiscriminatorSwitch } = this.props;
    const { enumSkipQuotes, hideSchemaTitles } = this.context;

    const { schema, description, example, deprecated, examples } = field;
    const { type } = schema;
    const isArrayType = type === 'array';

    const rawDefault = !!enumSkipQuotes || field.in === 'header'; // having quotes around header field default values is confusing and inappropriate

    let renderedExamples: JSX.Element | null = null;

    if (showExamples && (example !== undefined || examples !== undefined)) {
      if (examples !== undefined) {
        renderedExamples = <Examples field={field} />;
      } else {
        const label = l('example') + ':';
        const raw = !!field.in;
        renderedExamples = <FieldDetail label={label} value={getSerializedValue(field, field.example)} raw={raw} />;
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
          {schema.contentEncoding && (
            <TypeFormat>
              {' '}&lt;
              {schema.contentEncoding}
              &gt;{' '}
            </TypeFormat>
          )}
          {schema.contentMediaType && (
            <TypeFormat>
              {' '}&lt;
              {schema.contentMediaType}
              &gt;{' '}
            </TypeFormat>
          )}
          {schema.title && !hideSchemaTitles && <TypeTitle> ({schema.title}) </TypeTitle>}
          <ConstraintsView constraints={schema.constraints} />
          <Pattern schema={schema}/>
          {schema.isCircular && <RecursiveLabel> {l('recursive')} </RecursiveLabel>}
        </div>
        {deprecated && (
          <div>
            <Badge type="warning"> {l('deprecated')} </Badge>
          </div>
        )}
        <FieldDetail raw={rawDefault} label={l('default') + ':'} value={schema.default} />
        {!renderDiscriminatorSwitch && <EnumValues isArrayType={isArrayType} values={schema.enum} />}{' '}
        {renderedExamples}
        {<Extensions extensions={{ ...field.extensions, ...schema.extensions }} />}
        <div>
          <Markdown compact={true} source={description} />
        </div>
        {schema.externalDocs && (
          <ExternalDocumentation externalDocs={schema.externalDocs} compact={true} />
        )}
        {(renderDiscriminatorSwitch && renderDiscriminatorSwitch(this.props)) || null}
        {field.const && (<FieldDetail label={l('const') + ':'} value={field.const} />) || null}
        {isArrayType && schema.items && <ArrayItemDetails schema={schema.items}/>}
      </div>
    );
  }
}
