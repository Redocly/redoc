import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { PropertyType, SwitcherOptionType } from '../../../types/schema.js';

import {
  PropertyItem,
  Row,
  NameWrapper,
  PropertyName,
  RequiredLabel,
  SchemaTypeLabel,
  SwitcherWrapper,
  SwitcherBadge,
  FieldDetail,
  FieldDetailLabel,
  FieldDetailValue,
  DefaultValueTag,
  ExampleValueTag,
  ExampleJsonViewer,
  ParentPrefix,
} from '../styled.js';
import { isStructuredExample } from '../../../types/schema.js';
import { SchemaDescription } from '../SchemaDescription.js';
import { SchemaEnumValues } from './SchemaEnumValues.js';
import { SchemaEnumDescriptions } from './SchemaEnumDescriptions.js';
import { getDiscriminatorEnumRender, getSchemaEnumRowLabel } from '../utils.js';
import { SchemaVariantSelector } from './SchemaVariantSelector.js';
import { SchemaTitleLabel } from './SchemaTitleLabel.js';
import { Pattern } from './Pattern.js';
import { DeepLinkAnchor } from '../../common/DeepLinkAnchor.js';
import { getDeepLinkId, stripVariantMarkers } from '../../../utils/deep-link.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { useSchemaFieldDeepLink } from '../hooks/useSchemaFieldDeepLink.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { SECTION_ATTR } from '../../../constants/openapi.js';
import { renderPropertyBadge } from '../../common/Badge.js';
import { splitBadgesByPosition } from '../../../utils/split-badges-by-position.js';

export type DiscriminatorPropertyRowProps = {
  fieldName: string;
  property: PropertyType;
  isFirst: boolean;
  mappingKeys: string[];
  optionEntries: [string, SwitcherOptionType][];
  fieldParentsName: string[];
  activeIdx: number;
  onSelect: (idx: number) => void;
};

export function DiscriminatorPropertyRow({
  fieldName,
  property: prop,
  isFirst,
  mappingKeys,
  optionEntries,
  activeIdx,
  fieldParentsName = [],
  onSelect,
}: DiscriminatorPropertyRowProps): ReactElement {
  const { hidePropertiesPrefix, jsonSamplesExpandLevel } = useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();
  const { enumDescriptions, enumValues } = getDiscriminatorEnumRender(prop, mappingKeys);
  const enumLabel = getSchemaEnumRowLabel(prop.type, enumValues.length);
  const showConstValue = prop.const !== undefined && prop.const !== '';
  const fieldPath = [...fieldParentsName, fieldName].join('/');
  const propertyDeepLink = useSchemaFieldDeepLink(fieldPath);
  const { before: beforeBadges, after: afterBadges } = splitBadgesByPosition(prop.badges);

  return (
    <PropertyItem $isFirst={isFirst} id={getDeepLinkId(propertyDeepLink)}>
      <Row>
        <NameWrapper>
          {propertyDeepLink && (
            <DeepLinkAnchor to={propertyDeepLink} label={`link to ${fieldName}`} variant="field" />
          )}
          {!hidePropertiesPrefix &&
            fieldParentsName.map((parentName, index) => {
              const displayName = stripVariantMarkers(parentName);
              if (!displayName) return null;
              return (
                <ParentPrefix key={index}>
                  {displayName}.{'\u200B'}
                </ParentPrefix>
              );
            })}
          {beforeBadges.map(renderPropertyBadge)}
          <PropertyName className="schema-name">{fieldName}</PropertyName>
        </NameWrapper>
        <SchemaTypeLabel>{prop.type}</SchemaTypeLabel>
        <SchemaTitleLabel title={prop.title} schemaName={prop.schemaName} />
        {prop.isRequired ? (
          <RequiredLabel>{translate('required', 'required')}</RequiredLabel>
        ) : null}
        {afterBadges.map(renderPropertyBadge)}
      </Row>
      <SchemaDescription value={prop.description} />
      {prop.default !== undefined ? (
        <FieldDetail>
          <FieldDetailLabel>{translate('default', 'Default')}:</FieldDetailLabel>
          <DefaultValueTag>{prop.default}</DefaultValueTag>
        </FieldDetail>
      ) : null}
      {enumDescriptions ? (
        <SchemaEnumDescriptions values={enumDescriptions} />
      ) : enumValues.length > 0 ? (
        <SchemaEnumValues label={enumLabel} values={enumValues} />
      ) : null}
      {prop.example !== undefined ? (
        <FieldDetail>
          <FieldDetailLabel>{translate('example', 'Example')}:</FieldDetailLabel>
          {isStructuredExample(prop.example) ? (
            <ExampleJsonViewer
              data={prop.example}
              expandLevel={jsonSamplesExpandLevel}
              controls={false}
            />
          ) : (
            <ExampleValueTag>{prop.example}</ExampleValueTag>
          )}
        </FieldDetail>
      ) : null}
      <Pattern pattern={prop.pattern} />
      <SwitcherWrapper {...{ [SECTION_ATTR]: 'switcher' }}>
        <SwitcherBadge>{translate('discriminator', 'Discriminator')}</SwitcherBadge>
        <SchemaVariantSelector
          optionEntries={optionEntries}
          activeIndex={activeIdx}
          onChange={onSelect}
          data-testid="discriminator-schema"
        />
      </SwitcherWrapper>
      {showConstValue ? (
        <FieldDetail>
          <FieldDetailLabel>{translate('value', 'Value')}:</FieldDetailLabel>
          <FieldDetailValue>{prop.const}</FieldDetailValue>
        </FieldDetail>
      ) : null}
    </PropertyItem>
  );
}
