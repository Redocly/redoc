import { memo, useState, useCallback } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { ItemContentNode } from '../../../types/content.js';

import { SchemaView } from '../../Schema/SchemaView.js';
import { DeprecatedBadge } from '../../Schema/styled.js';
import { useSpecTranslate } from '../../../hooks/useTranslate.js';

type FieldData = {
  name: string;
  type?: string;
  description?: unknown;
  deprecated?: boolean;
  deprecationReason?: string;
  defaultValue?: unknown;
  args?: Array<{
    name: string;
    type?: string;
    description?: unknown;
    defaultValue?: unknown;
  }>;
};

function FieldsSectionComponent({ node }: { node: ItemContentNode }): ReactElement {
  const fields = node.graphqlSchema;

  if (Array.isArray(fields)) {
    return (
      <FieldList>
        {fields.map((raw: unknown, index: number) => (
          <FieldRow key={`field-${index}`} field={raw as FieldData} />
        ))}
      </FieldList>
    );
  }

  if (node.schemaId) {
    return <SchemaView schemaId={node.schemaId} expandByDefault />;
  }

  return <></>;
}

export const FieldsSection = memo(FieldsSectionComponent);

function FieldRow({ field }: { field: FieldData }): ReactElement {
  const translate = useSpecTranslate();
  const args = field.args ?? [];
  const hasArgs = args.length > 0;
  const [argsExpanded, setArgsExpanded] = useState(false);
  const toggleArgs = useCallback(() => setArgsExpanded((v) => !v), []);

  return (
    <FieldItem>
      <Row>
        <PropertyName $deprecated={field.deprecated}>
          {field.name}
          {hasArgs && (
            <InlineArgs>({args.length === 1 ? args[0].name : `...${args.length} args`})</InlineArgs>
          )}
        </PropertyName>
        {field.type && <SchemaTypeLabel>{field.type}</SchemaTypeLabel>}
        {field.deprecated ? (
          <DeprecatedBadge>{translate('badges.deprecated', 'deprecated')}</DeprecatedBadge>
        ) : null}
        {field.defaultValue !== undefined ? (
          <DefaultValue>= {JSON.stringify(field.defaultValue)}</DefaultValue>
        ) : null}
      </Row>

      {field.deprecationReason && <DeprecationReason>{field.deprecationReason}</DeprecationReason>}

      {hasArgs && (
        <ArgsToggle onClick={toggleArgs}>
          {argsExpanded
            ? `▾ ${translate('arguments.hide', 'Hide arguments')}`
            : `▸ ${translate('arguments.show', 'Show arguments')} (${args.length})`}
        </ArgsToggle>
      )}

      {hasArgs && argsExpanded && (
        <ArgsList>
          {args.map((arg, i) => (
            <ArgItem key={`${arg.name}-${i}`}>
              <Row>
                <ArgName>{arg.name}</ArgName>
                {arg.type && <SchemaTypeLabel>{arg.type}</SchemaTypeLabel>}
              </Row>
              {arg.defaultValue !== undefined ? (
                <DefaultValue>
                  {translate('default', 'Default')}: {JSON.stringify(arg.defaultValue)}
                </DefaultValue>
              ) : null}
            </ArgItem>
          ))}
        </ArgsList>
      )}
    </FieldItem>
  );
}

const FieldList = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldItem = styled.div`
  padding: var(--schema-property-details-spacing, var(--spacing-base)) 0 0;
  border-bottom: 1px solid var(--border-color-primary);

  &:last-child {
    border-bottom: none;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-xxs) / 4) var(--spacing-xxs);
  flex-wrap: wrap;
  margin-bottom: 2px;
`;

const PropertyName = styled.span<{ $deprecated?: boolean }>`
  font-family: var(--font-family-monospaced);
  font-weight: var(--font-weight-bold);
  font-size: var(--schemas-property-name-font-size, var(--font-size-base));
  line-height: var(
    --schemas-property-name-line-height,
    var(--line-height-base)
  );
  color: var(--schemas-property-name-text-color, var(--text-color-primary));
  ${({ $deprecated }) =>
    $deprecated &&
    'text-decoration: line-through; color: var(--schemas-property-deprecated-text-color, var(--text-color-description));'}
`;

const InlineArgs = styled.span`
  font-weight: var(--font-weight-regular);
  color: var(--text-color-secondary);
`;

const SchemaTypeLabel = styled.span`
  color: var(--schema-type-text-color, var(--text-color-secondary));
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

const DeprecationReason = styled.div`
  margin-top: 2px;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--badge-deprecated-text-color);
  font-style: italic;
`;

const DefaultValue = styled.span`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--text-color-secondary);
  font-family: var(--font-family-monospaced);
`;

const ArgsToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--link-color-primary, var(--text-color-secondary));
  font-family: var(--font-family-base);
  margin-top: var(--spacing-xxs);

  &:hover {
    text-decoration: underline;
  }
`;

const ArgsList = styled.div`
  margin-top: var(--spacing-xxs);
  margin-left: 9px;
  padding-left: var(--schema-nested-offset, 10px);
  border-left: 1px solid var(--border-color-primary);
`;

const ArgItem = styled.div`
  padding: var(--spacing-xxs) 0;
  border-bottom: 1px solid var(--border-color-primary);

  &:last-child {
    border-bottom: none;
  }
`;

const ArgName = styled.span`
  font-family: var(--font-family-monospaced);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-primary);
`;
