import { memo, useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { FieldProps } from './types.js';

import { LinkIcon } from '@redocly/theme/icons/LinkIcon/LinkIcon';

import { RecursiveLabel, Tag, AccessLabel, RequiredLabel, StyledBadge } from '../common/index.js';
import { ExternalDocumentation } from '../ExternalDocumentation/index.js';
import { Markdown } from '../Markdown/index.js';
import { FieldDetail } from './FieldDetail.js';
import { Extensions } from './Extensions.js';
import { EnumValues } from './EnumValues.js';
import { Examples, getSerializedValue } from './Examples.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { SchemaTypeInfo } from './SchemaTypeInfo.js';
import { LinkToField } from '../common/LinkToField.js';
import { Pattern } from './Pattern.js';
import { getAccessModeLabelText } from '../RenderHook/index.js';
import { useTranslate } from '../../hooks/index.js';
import { styled } from '../../styled-components.js';

function FieldDetailsComponent({
  field,
  renderDiscriminatorSwitch,
  deepLink,
  fieldParentsName = [],
}: FieldProps): ReactElement {
  const translate = useTranslate();
  const { hidePropertiesPrefix, hideSchemaTitles } = useAtomValue(globalOptionsAtom);
  const { schema, description, example, deprecated, examples, kind, required, name } = field;

  const rawDefault = field.in === 'header'; // having quotes around header field default values is confusing and inappropriate

  const renderedExamples = useMemo(() => {
    if (example !== undefined || examples !== undefined) {
      if (examples !== undefined) {
        return <Examples field={field} />;
      } else {
        const raw = !!field.in;
        return (
          <FieldDetail
            label={`${translate('openapi.example', 'Example')}:`}
            value={getSerializedValue(field, field.example)}
            raw={raw}
          />
        );
      }
    } else return null;
  }, [example, examples, field, translate]);

  const accessMode = getAccessModeLabelText(field.schema);

  return (
    <>
      <Row>
        {name && (
          <Name>
            {deepLink && <LinkToField to={deepLink} />}
            {!hidePropertiesPrefix &&
              fieldParentsName.map(
                (name) => name + '.\u200B', // zero-width space, a special character is used for correct line breaking
              )}
            <SchemaName className="schema-name">{name}</SchemaName>
          </Name>
        )}
        <SchemaTypeInfo type={schema.typePrefix + schema.displayType} />
        <SchemaTypeInfo type={schema.displayFormat && `(${schema.displayFormat})`} />
        <SchemaTypeInfo type={schema.contentEncoding} />
        <SchemaTypeInfo type={schema.title && !hideSchemaTitles ? `(${schema.title})` : ''} />
        {schema.constraints?.map((constraint) => (
          <SchemaTypeInfo type={constraint} key={constraint} />
        ))}
        {deprecated && (
          <StyledBadge deprecated>
            {translate('openapi.badges.deprecated', 'Deprecated')}
          </StyledBadge>
        )}
        <Pattern pattern={schema.pattern} />
        {kind === 'additionalProperties' && (
          <Tag>{translate('openapi.additionalProperties', 'additional property')}</Tag>
        )}
        {kind === 'patternProperties' && (
          <Tag>{translate('openapi.patternProperties', 'pattern property')}</Tag>
        )}
        {accessMode && <AccessLabel>{accessMode}</AccessLabel>}
        {required && <RequiredLabel>{translate('openapi.required', 'required')}</RequiredLabel>}
        {schema.isCircular && (
          <RecursiveLabel>{translate('openapi.recursive', 'Recursive')}</RecursiveLabel>
        )}
      </Row>
      {schema.isComplex && (
        <RecursiveLabel>{translate('openapi.complex', 'Complex')}</RecursiveLabel>
      )}
      <StyledDescription source={description} />
      <FieldDetail
        raw={rawDefault}
        type="default"
        label={translate('openapi.default', 'Default')}
        value={schema.default}
      />
      <EnumValues type={schema.type} values={schema['x-enumDescriptions'] || schema.enum} />
      {renderedExamples}
      <Extensions extensions={{ ...field.extensions, ...schema.extensions }} />
      {schema.externalDocs && <ExternalDocumentation externalDocs={schema.externalDocs} compact />}
      {renderDiscriminatorSwitch?.()}
      <FieldDetail label={translate('openapi.value', 'Value')} value={field.const || undefined} />
    </>
  );
}

export const FieldDetails = memo<FieldProps>(FieldDetailsComponent);

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-xxs) / 4) var(--spacing-xxs);
  flex-wrap: wrap;
  margin-bottom: 2px;
  position: relative;
`;

const StyledDescription = styled(Markdown)`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);

  article p:last-child {
    margin-bottom: 0;
  }
`;

const Name = styled.span`
  position: relative;
  font-family: var(--font-family-monospaced);
  line-height: var(--line-height-base);
  font-size: var(--font-size-base);
  color: var(--text-color-description);
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;

  :hover {
    ${LinkIcon} {
      opacity: 1;
      visibility: visible;
      background-color: var(--bg-color);
    }
  }
`;

const SchemaName = styled.span`
  font-family: var(--font-family-monospaced);
  font-weight: var(--font-weight-semibold);
  font-size: var(--schemas-property-name-font-size);
  line-height: var(--schemas-property-name-line-height);
  color: var(--text-color-primary);
`;
