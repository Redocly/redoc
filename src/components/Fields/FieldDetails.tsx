import * as React from 'react';
import { observer } from 'mobx-react';

import {
  RecursiveLabel,
  TypeFormat,
  TypeName,
  TypePrefix,
  TypeTitle,
} from '../../common-elements/fields';
import { getSerializedValue, isArray, isObject } from '../../utils';
import { ExternalDocumentation } from '../ExternalDocumentation/ExternalDocumentation';
import { Markdown } from '../Markdown/Markdown';
import { EnumValues } from './EnumValues';
import { Extensions } from './Extensions';
import { FieldProps } from './Field';
import { Examples } from './Examples';
import { ConstraintsView } from './FieldConstraints';
import { FieldDetail } from './FieldDetail';

import { Badge } from '../../common-elements/';

import { l } from '../../services/Labels';
import { OptionsContext } from '../OptionsProvider';
import { Pattern } from './Pattern';
import { ArrayItemDetails } from './ArrayItemDetails';

export const FieldDetailsComponent = observer((props: FieldProps) => {
  const { enumSkipQuotes, hideSchemaTitles } = React.useContext(OptionsContext);

  const { showExamples, field, renderDiscriminatorSwitch } = props;
  const { schema, description, deprecated, extensions, in: _in, const: _const } = field;
  const isArrayType =
    schema.type === 'array' || (isArray(schema.type) && schema.type.includes('array'));

  const rawDefault = enumSkipQuotes || _in === 'header'; // having quotes around header field default values is confusing and inappropriate

  const renderedExamples = React.useMemo<JSX.Element | null>(() => {
    if (showExamples && (field.example !== undefined || field.examples !== undefined)) {
      if (field.examples !== undefined) {
        return <Examples field={field} />;
      } else {
        return (
          <FieldDetail
            label={l('example') + ':'}
            value={getSerializedValue(field, field.example)}
            raw={Boolean(field.in)}
          />
        );
      }
    }

    return null;
  }, [field, showExamples]);
  const defaultValue =
    isObject(schema.default) && field.in
      ? getSerializedValue(field, schema.default).replace(`${field.name}=`, '')
      : schema.default;

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
            {' '}
            &lt;
            {schema.contentEncoding}
            &gt;{' '}
          </TypeFormat>
        )}
        {schema.contentMediaType && (
          <TypeFormat>
            {' '}
            &lt;
            {schema.contentMediaType}
            &gt;{' '}
          </TypeFormat>
        )}
        {schema.title && !hideSchemaTitles && <TypeTitle> ({schema.title}) </TypeTitle>}
        <ConstraintsView constraints={schema.constraints} />
        <Pattern schema={schema} />
        {schema.isCircular && <RecursiveLabel> {l('recursive')} </RecursiveLabel>}
        {isArrayType && schema.items && <ArrayItemDetails schema={schema.items} />}
      </div>
      {deprecated && (
        <div>
          <Badge type="warning"> {l('deprecated')} </Badge>
        </div>
      )}
      <FieldDetail raw={rawDefault} label={l('default') + ':'} value={defaultValue} />
      {!renderDiscriminatorSwitch && (
        <EnumValues type={schema.type} values={schema['x-enumDescriptions'] || schema.enum} />
      )}{' '}
      {renderedExamples}
      <Extensions extensions={{ ...extensions, ...schema.extensions }} />
      <div>
        <Markdown compact={true} source={description} />
      </div>
      {schema.externalDocs && (
        <ExternalDocumentation externalDocs={schema.externalDocs} compact={true} />
      )}
      {(renderDiscriminatorSwitch && renderDiscriminatorSwitch(props)) || null}
      {(_const && <FieldDetail label={l('const') + ':'} value={_const} />) || null}
    </div>
  );
});

export const FieldDetails = React.memo<FieldProps>(FieldDetailsComponent);
