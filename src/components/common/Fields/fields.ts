import { Button } from '@redocly/theme/components/Button/Button';

import { styled } from '../../../styled-components.js';

export const FieldLabel = styled.span`
  vertical-align: middle;
  line-height: var(--schema-labels-line-height);
  font-size: var(--schema-property-labels-font-size);
  color: var(--schema-labels--text-color);
`;

export const TypePrefix = styled(FieldLabel)`
  color: var(--schema-type-text-color);
`;

export const TypeName = styled(FieldLabel)`
  color: var(--schema-type-text-color);
`;

export const TypeTitle = styled(FieldLabel)`
  color: var(--schema-type-title-text-color);
  word-break: break-word;
`;

export const PropertyLabel = styled(FieldLabel).attrs({ as: 'div' })`
  color: var(--text-color-secondary);
  font-size: var(--schema-labels-font-size);
  line-height: var(--schema-labels-line-height);
  font-weight: normal;
  display: block;
`;

export const RequiredLabel = styled(FieldLabel)`
  color: var(--schema-property-required-label-text-color);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

export const AdditionalPropertiesLabel = styled(PropertyLabel)`
  color: var(--schema-property-additional-label-text-color);
`;

export const Tag = styled.span.attrs(() => ({ className: 'tag-grey' }))`
  background: var(--tag-bg-color);
  padding: 0 var(--spacing-xxs);
  font-family: var(--font-family-monospaced);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  border-radius: var(--border-radius);
  color: var(--text-color-secondary);
  display: inline-flex;
  word-break: var(--code-word-break);
`;

export const AccessLabel = styled(Tag)`
  color: var(--schema-property-access-label-text-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color-secondary);
`;

export const FieldValueLabel = styled(Tag)`
  background-color: var(--schema-inline-bg-color);
  border-radius: var(--border-radius);
  border: var(--schema-inline-border);
  padding: 0 var(--spacing-unit);
  width: fit-content;
`;

export const RecursiveLabel = styled(Tag)`
  background-color: var(--schema-recursive-bg-color);
  border-color: var(--schema-recursive-border-color);
  color: var(--schema-recursive-text-color);
  padding: 0 var(--spacing-xs);
`;

export const EnumValue = styled(FieldValueLabel)`
  background-color: var(--schema-enum-bg-color);
  border-color: var(--schema-enum-border-color);
  color: var(--schema-enum-text-color);
`;

export const DefaultValue = styled(Tag)`
  background-color: var(--schema-default-bg-color);
  border-color: var(--schema-default-border-color);
  color: var(--schema-default-text-color);
`;

export const ExampleValue = styled(Tag)`
  background-color: var(--schema-example-bg-color);
  border-color: var(--schema-example-border-color);
  color: var(--schema-example-text-color);
  word-break: var(--code-word-break);

  & + & {
    margin-left: 0;
  }

  display: inline-flex;
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  & p,
  p:only-of-type {
    font-size: var(--schema-inline-code-font-size);
    font-family: var(--schema-inline-code-font-family);
    margin: 0;
  }
`;

export const ExtensionValue = styled(ExampleValue)``;

export const ConstraintItem = styled(FieldValueLabel)`
  background-color: var(--schema-constraint-bg-color);
  border-color: var(--schema-constraint-border-color);
  color: var(--schema-constraint-text-color);
  word-break: var(--code-word-break);
  margin: 0 var(--spacing-unit);

  & + & {
    margin-left: 0;
  }
`;

export const ToggleButton = styled(Button).attrs(() => ({
  variant: 'link',
  size: 'small',
}))`
  padding: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
`;
