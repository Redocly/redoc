import * as React from 'react';

import {
  PatternLabel,
  RecursiveLabel,
  TypeFormat,
  TypeName,
  TypePrefix,
  TypeTitle,
  ToggleButton,
  FieldLabel,
  ExampleValue,
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
import { FieldModel } from '../../services/models/Field';
import styled from '../../styled-components';

const MAX_PATTERN_LENGTH = 45;

export class FieldDetails extends React.PureComponent<FieldProps, { patternShown: boolean }> {
  state = {
    patternShown: false,
  };

  static contextType = OptionsContext;

  togglePattern = () => {
    this.setState({
      patternShown: !this.state.patternShown,
    });
  };

  render() {
    const { showExamples, field, renderDiscriminatorSwitch } = this.props;
    const { patternShown } = this.state;
    const { enumSkipQuotes, hideSchemaTitles, hideSchemaPattern } = this.context;

    const { schema, description, example, deprecated, examples } = field;

    const rawDefault = !!enumSkipQuotes || field.in === 'header'; // having quotes around header field default values is confusing and inappropriate

    let renderedExamples: JSX.Element | null = null;

    if (showExamples && (example !== undefined || examples !== undefined)) {
      if (examples !== undefined) {
        renderedExamples = <Examples field={field} />;
      } else {
        const label = l('example') + ':';
        const raw = !!field.in;
        renderedExamples = (
          <FieldDetail label={label} value={getSerializedValue(field, field.example)} raw={raw} />
        );
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
          {schema.pattern && !hideSchemaPattern && (
            <>
              <PatternLabel>
                {patternShown || schema.pattern.length < MAX_PATTERN_LENGTH
                  ? schema.pattern
                  : `${schema.pattern.substr(0, MAX_PATTERN_LENGTH)}...`}
              </PatternLabel>
              {schema.pattern.length > MAX_PATTERN_LENGTH && (
                <ToggleButton onClick={this.togglePattern}>
                  {patternShown ? 'Hide pattern' : 'Show pattern'}
                </ToggleButton>
              )}
            </>
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
        {renderedExamples}
        {<Extensions extensions={{ ...field.extensions, ...schema.extensions }} />}
        <div>
          <Markdown compact={true} source={description} />
        </div>
        {schema.externalDocs && (
          <ExternalDocumentation externalDocs={schema.externalDocs} compact={true} />
        )}
        {(renderDiscriminatorSwitch && renderDiscriminatorSwitch(this.props)) || null}
        {(field.const && <FieldDetail label={l('const') + ':'} value={field.const} />) || null}
      </div>
    );
  }
}

function Examples({ field }: { field: FieldModel }) {
  if (!field.examples) {
    return null;
  }

  return (
    <>
      <FieldLabel> {l('examples')}: </FieldLabel>
      <ExamplesList>
        {Object.values(field.examples).map((example, idx) => {
          return (
            <li key={idx}>
              <ExampleValue>{getSerializedValue(field, example.value)}</ExampleValue> -{' '}
              {example.summary || example.description}
            </li>
          );
        })}
      </ExamplesList>
    </>
  );
}

function getSerializedValue(field: FieldModel, example: any) {
  if (field.in) {
    // decode for better readability in examples: see https://github.com/Redocly/redoc/issues/1138
    return decodeURIComponent(serializeParameterValue(field, example));
  } else {
    return example;
  }
}

const ExamplesList = styled.ul`
  margin-top: 1em;
  padding-left: 0;
  list-style-position: inside;
`;
