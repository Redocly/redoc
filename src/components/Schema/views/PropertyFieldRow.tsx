import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';
import type { PropertyType } from '../../../types/schema.js';
import type { OneOfChangeParams } from '../../../types/pluggable.js';

import { isStructuredExample } from '../../../types/schema.js';
import { getSchemaEnumRowLabel } from '../utils.js';
import {
  Row,
  NameWrapper,
  ParentPrefix,
  PropertyName,
  SchemaTypeLabel,
  RequiredLabel,
  DeprecatedBadge,
  AccessLabel,
  AdditionalPropertyLabel,
  RecursiveLabel,
  ExternalDocsLink,
  FieldDetail,
  FieldDetailLabel,
  DefaultValueTag,
  FieldDetailValue,
  PropertyItem,
  ExampleJsonViewer,
} from '../styled.js';
import { SchemaDescription } from '../SchemaDescription.js';
import { renderExternalDocsLabel } from '../helpers.js';
import { SchemaEnumValues } from './SchemaEnumValues.js';
import { SchemaEnumDescriptions } from './SchemaEnumDescriptions.js';
import { VendorExtensions } from '../../common/VendorExtensions.js';
import { DeepLinkAnchor } from '../../common/DeepLinkAnchor.js';
import { renderPropertyBadge } from '../../common/Badge.js';
import { getDeepLinkId, stripVariantMarkers } from '../../../utils/deep-link.js';
import { getExtensionsForDisplay } from '../../../utils/extract-extensions.js';
import { splitBadgesByPosition } from '../../../utils/split-badges-by-position.js';
import { globalOptionsAtom } from '../../../jotai/store.js';
import { PropertyRenderer } from './PropertyRenderer.js';
import { SchemaTitleLabel } from './SchemaTitleLabel.js';
import { CollapsibleNestedFields } from './CollapsibleNestedFields.js';
import { useSchemaFieldDeepLink } from '../hooks/useSchemaFieldDeepLink.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';
import { Examples } from './Examples.js';
import { ExpandableExample } from './ExpandableExample.js';
import { Pattern } from './Pattern.js';

type PropertyFieldRowProps = {
  name: string;
  property: PropertyType;
  level: number;
  expandByDefault?: boolean;
  isFirst?: boolean;
  fieldParentsName?: string[];
  skipReadOnly?: boolean;
  skipWriteOnly?: boolean;
  onOneOfChange?: (params: OneOfChangeParams) => void;
};

export function PropertyFieldRow({
  name,
  property,
  level,
  expandByDefault,
  isFirst,
  fieldParentsName = [],
  skipReadOnly,
  skipWriteOnly,
  onOneOfChange,
}: PropertyFieldRowProps): ReactElement {
  const { hidePropertiesPrefix, showExtensions, jsonSamplesExpandLevel } =
    useAtomValue(globalOptionsAtom);
  const translate = useSpecTranslate();

  const hasSwitcher = Boolean(property.switcher);
  const hasCollapsibleNested =
    !property.isCircular &&
    (!!property.properties || !!(property.items && property.items.length > 0));

  const fieldPath = useMemo(() => {
    return [...fieldParentsName, name].join('/');
  }, [fieldParentsName, name]);
  const propertyDeepLink = useSchemaFieldDeepLink(fieldPath);

  const enumValues = property.enum;
  const enumDescriptions = enumValues && !Array.isArray(enumValues) ? enumValues : undefined;
  const enumArray = enumValues && Array.isArray(enumValues) ? enumValues : undefined;

  const extensionsRecord = getExtensionsForDisplay(property.extensions ?? {}, showExtensions);

  const nestedSchemaRenderer = useMemo(() => {
    if (hasSwitcher && property.switcher?.type !== 'discriminator') {
      return (
        <PropertyRenderer
          property={property}
          level={level + 1}
          fieldParentsName={[...fieldParentsName, name]}
          skipReadOnly={skipReadOnly}
          skipWriteOnly={skipWriteOnly}
          onOneOfChange={onOneOfChange}
        />
      );
    }
    if ((hasSwitcher && property.switcher?.type === 'discriminator') || hasCollapsibleNested) {
      return (
        <CollapsibleNestedFields
          level={level}
          expandByDefault={expandByDefault}
          required={property.isRequired}
          skipReadOnly={skipReadOnly}
          skipWriteOnly={skipWriteOnly}
          property={property}
          fieldPath={fieldPath}
        >
          <PropertyRenderer
            property={property}
            level={level + 1}
            fieldParentsName={[...fieldParentsName, name]}
            skipReadOnly={skipReadOnly}
            skipWriteOnly={skipWriteOnly}
            onOneOfChange={onOneOfChange}
          />
        </CollapsibleNestedFields>
      );
    }

    return null;
  }, [
    expandByDefault,
    fieldParentsName,
    fieldPath,
    hasCollapsibleNested,
    hasSwitcher,
    level,
    name,
    property,
    skipReadOnly,
    skipWriteOnly,
    onOneOfChange,
  ]);

  const { before: beforeBadges, after: afterBadges } = splitBadgesByPosition(property.badges);

  return (
    <PropertyItem
      $isFirst={isFirst}
      id={getDeepLinkId(propertyDeepLink)}
      className="schema-property-item"
    >
      <Row>
        <NameWrapper>
          {propertyDeepLink && (
            <DeepLinkAnchor to={propertyDeepLink} label={`link to ${name}`} variant="field" />
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
          <PropertyName $deprecated={property.isDeprecated} className="schema-name">
            {name}
          </PropertyName>
        </NameWrapper>
        <SchemaTypeLabel>{property.type}</SchemaTypeLabel>
        <SchemaTitleLabel title={property.title} schemaName={property.schemaName} />
        <Pattern pattern={property.pattern} />
        {property.accessMode ? <AccessLabel>{property.accessMode}</AccessLabel> : null}
        {property.isRequired ? (
          <RequiredLabel>{translate('required', 'required')}</RequiredLabel>
        ) : null}
        {property.isDeprecated ? (
          <DeprecatedBadge>{translate('badges.deprecated', 'deprecated')}</DeprecatedBadge>
        ) : null}
        {property.isAdditionalProperty ? (
          <AdditionalPropertyLabel>
            {translate('additionalProperties', 'additional property')}
          </AdditionalPropertyLabel>
        ) : null}
        {property.isPatternProperty ? (
          <AdditionalPropertyLabel>
            {translate('patternProperties', 'pattern property')}
          </AdditionalPropertyLabel>
        ) : null}
        {property.isCircular ? (
          <RecursiveLabel>{translate('recursive', 'Recursive')}</RecursiveLabel>
        ) : null}
        {afterBadges.map(renderPropertyBadge)}
      </Row>

      {!hasSwitcher && <SchemaDescription value={property.description} />}

      <VendorExtensions extensions={extensionsRecord} />

      {property.externalDocs?.url && (
        <ExternalDocsLink
          href={property.externalDocs.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderExternalDocsLabel(property.externalDocs.description)}
        </ExternalDocsLink>
      )}

      {property.default !== undefined ? (
        <FieldDetail>
          <FieldDetailLabel>{translate('default', 'Default')}:</FieldDetailLabel>
          <DefaultValueTag>{property.default}</DefaultValueTag>
        </FieldDetail>
      ) : null}

      {enumDescriptions ? (
        <SchemaEnumDescriptions values={enumDescriptions} type={property.type} />
      ) : enumArray && enumArray.length > 0 ? (
        <SchemaEnumValues
          label={getSchemaEnumRowLabel(property.type, enumArray.length)}
          values={enumArray}
        />
      ) : null}

      {property.example !== undefined ? (
        <FieldDetail>
          <FieldDetailLabel>{translate('example', 'Example')}:</FieldDetailLabel>
          {isStructuredExample(property.example) ? (
            <ExampleJsonViewer
              data={property.example}
              expandLevel={jsonSamplesExpandLevel}
              controls={false}
            />
          ) : (
            <ExpandableExample value={property.example} />
          )}
        </FieldDetail>
      ) : null}

      <Examples examples={property.examples} />

      {property.const !== undefined ? (
        <FieldDetail>
          <FieldDetailLabel>{translate('value', 'Value')}:</FieldDetailLabel>
          <FieldDetailValue>{property.const}</FieldDetailValue>
        </FieldDetail>
      ) : null}

      {nestedSchemaRenderer}
    </PropertyItem>
  );
}
