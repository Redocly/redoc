import { styled } from 'styled-components';
import { Link } from 'react-router';

import { JsonViewer } from '@redocly/theme/components/JsonViewer/JsonViewer';
import { linkCss } from '@redocly/theme/components/Markdown/styles/links';

import { LEVEL_COLORS } from './utils.js';

export const PropertyList = styled.div`
  display: flex;
  flex-direction: column;

  &:has(+ span.array-closing-label) > *:last-child {
    border-bottom: none;
    padding-bottom: calc(var(--schema-property-details-spacing) / 2);

    .view-nested-wrapper {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
`;

export const PropertyItem = styled.div<{ $isFirst?: boolean }>`
  width: 100%;
  padding: ${({ $isFirst }) => `var(--schema-${$isFirst ? 'fist-' : ''}property-details-spacing)`} 0
    var(--schema-property-details-spacing);
  border-bottom: 1px solid var(--border-color-primary);

  &:has([data-schema-nested-open='true']) {
    border-bottom: none;
    padding-bottom: 0;
  }

  p {
    margin-bottom: 0;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-xxs) / 4) var(--spacing-xxs);
  flex-wrap: wrap;
  margin-bottom: 2px;
  position: relative;

  svg {
    visibility: hidden;
  }

  &:hover svg {
    visibility: visible;
  }
`;

export const NameWrapper = styled.span`
  position: relative;
  font-family: var(--font-family-monospaced);
  line-height: var(--line-height-base);
  font-size: var(--font-size-base);
  color: var(--text-color-description);
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

export const ParentPrefix = styled.span`
  color: var(--text-color-description);
`;

export const PropertyName = styled.span<{ $deprecated?: boolean }>`
  font-family: var(--font-family-monospaced);
  font-weight: var(--font-weight-semibold);
  font-size: var(--schemas-property-name-font-size);
  line-height: var(--schemas-property-name-line-height);
  color: var(--schemas-property-name-text-color, var(--text-color-primary));
  ${({ $deprecated }) =>
    $deprecated &&
    'text-decoration: line-through; color: var(--schemas-property-deprecated-text-color, var(--text-color-description));'}
`;

export const SchemaTypeLabel = styled.em`
  vertical-align: middle;
  color: var(--schema-type-text-color, var(--text-color-secondary));
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-style: normal;
  overflow-wrap: anywhere;

  &::after {
    content: ',';
  }

  &:last-of-type::after {
    content: '';
  }

  &:last-of-type:has(+ a)::after {
    content: ',';
  }
`;

export const SchemaTitle = styled(Link)`
  vertical-align: middle;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-style: normal;
  overflow-wrap: anywhere;

  ${linkCss}
`;

export const RequiredLabel = styled.span`
  vertical-align: middle;
  color: var(--schema-property-required-label-text-color, #e20c0c);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;

const TagBase = styled.span`
  background: var(--tag-bg-color);
  padding: 0 var(--spacing-xxs);
  font-family: var(--font-family-monospaced);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  border-radius: var(--tag-border-radius);
  color: var(--text-color-secondary);
  display: inline-flex;
  word-break: var(--code-word-break);
`;

export const DeprecatedBadge = styled(TagBase)`
  color: var(--badge-deprecated-text-color);
  background-color: var(--badge-deprecated-bg-color);
  border-radius: var(--badge-deprecated-border-radius, var(--border-radius));
`;

export const AccessLabel = styled(TagBase)`
  color: var(--schema-property-access-label-text-color);
  background-color: var(--bg-color);
  border: 1px solid var(--border-color-secondary);
`;

export const AdditionalPropertyLabel = styled(TagBase)`
  background-color: var(--color-warm-grey-2);
`;

export const ConstraintsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xxs);
  margin: var(--spacing-xxs) 0 var(--spacing-xs);
`;

export const ConstraintBadge = styled(TagBase)`
  background-color: var(--color-warm-grey-2);
`;

export const RecursiveLabel = styled(TagBase)`
  background-color: var(--schema-recursive-bg-color);
  border-color: var(--schema-recursive-border-color);
  color: var(--schema-recursive-text-color);
  padding: 0 var(--spacing-xs);
`;

export const ExternalDocsLink = styled.a`
  color: var(--link-color, var(--color-primary-base, var(--link-color-primary)));
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Description = styled.div`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-description);

  p:last-child {
    margin-bottom: 0;
  }
`;

export const FieldDetail = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xxs);
  margin-top: var(--spacing-xxs);
  flex-wrap: wrap;
`;

export const FieldDetailLabel = styled.span`
  vertical-align: middle;
  line-height: var(--schema-labels-line-height);
  font-size: var(--schema-property-labels-font-size);
  color: var(--schema-labels--text-color);
`;

export const FieldDetailValue = styled(TagBase)`
  background-color: var(--schema-inline-bg-color);
  border: var(--schema-inline-border);
  padding: 0 var(--spacing-unit);
  width: fit-content;
`;

export const PatternValue = styled(FieldDetailValue)`
  border: none;
`;

export const DefaultValueTag = styled(TagBase)`
  background-color: var(--schema-default-bg-color);
  border-color: var(--schema-default-border-color);
  color: var(--schema-default-text-color);
`;

export const ExampleValueTag = styled(TagBase)`
  background-color: var(--schema-example-bg-color);
  border: 1px solid var(--schema-example-border-color);
  color: var(--schema-example-text-color);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  width: fit-content;
`;

export const ExampleJsonViewer = styled(JsonViewer)`
  flex-basis: 100%;
  min-width: 0;
  border: 1px solid var(--border-color-secondary);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
`;

export const ExamplesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xxs);
  padding-left: var(--spacing-base);
`;

export const ExampleItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ExampleSummary = styled.div`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-primary);
`;

export const ExampleDescription = styled.div`
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color-description);
`;

export const EnumRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xxs);
  margin-top: var(--spacing-xxs);
`;

export const EnumValue = styled(TagBase)`
  background-color: var(--schema-enum-bg-color);
  color: var(--schema-enum-text-color);
  padding: 0 var(--spacing-unit);
  width: fit-content;
`;

export const EnumExpandToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  line-height: var(--line-height-base);
  text-decoration: underline;
  align-self: center;

  &:hover {
    color: var(--text-color-primary);
  }
`;

export const ShowProperty = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  gap: var(--spacing-xxs);
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  font-family: var(--font-family-base);
  line-height: var(--line-height-base);
  margin-top: var(--spacing-xxs);
  width: 100%;
  min-height: 24px;
`;

export const CircleIconSpan = styled.span<{ $color?: string }>`
  background-color: var(--bg-color);
  border-radius: 50%;
  border: 1px solid ${({ $color }) => $color || 'var(--border-color-primary)'};
  font-size: var(--font-size-lg);
  line-height: var(--font-size-lg);
  color: ${({ $color }) => $color || 'var(--text-color-secondary)'};
  width: 20px;
  height: 20px;
`;

export const NestedWrapper = styled.div`
  width: 100%;
`;

export const StyledNested = styled.div<{ $level: number }>`
  padding-left: var(--schema-nested-offset);
  border-left: 1px solid
    ${({ $level }) => LEVEL_COLORS[$level % LEVEL_COLORS.length] || 'var(--border-color-primary)'};
  margin: -10px 0 0 9px;

  ${({ $level }) => {
    const color = LEVEL_COLORS[$level % LEVEL_COLORS.length];
    return color
      ? `
      .schema-name {
        color: ${color};
      }
    `
      : '';
  }}
`;

export const ArrayWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ArrayLabel = styled.span`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
`;

export const ArrayClosingLabel = styled(ArrayLabel)`
  margin-top: 0;
  width: 100%;
`;

export const ArrayLabelValue = styled.span`
  padding: 0 var(--spacing-xs);
  border-radius: var(--tag-border-radius);
  border: 1px solid var(--border-color-secondary);
  background-color: var(--bg-color);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--tag-basic-content-color);
`;

export const ArrayLine = styled.span`
  flex: 1;
  border-top: 1px solid var(--border-color-primary);
`;

export const OneOfWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

export const PrimitiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xxs);
`;

export const PrimitiveOptionWrapper = styled(PrimitiveWrapper)`
  padding-bottom: var(--schema-property-details-spacing);
  border-bottom: 1px solid var(--border-color-primary);

  .schema-property-item & {
    padding-bottom: 0;
    border-bottom: none;
  }
`;

export const SwitcherWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const SwitcherBadge = styled.div`
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  color: var(--tag-basic-content-color);
  padding: 0 var(--spacing-xs);
  border: 1px solid var(--border-color-secondary);
  border-radius: var(--tag-border-radius);
  margin: var(--spacing-xxs) 0 var(--spacing-xs);
  position: relative;
  width: fit-content;

  &:before {
    content: ' ';
    width: 1px;
    height: var(--spacing-xs);
    background: var(--border-color-secondary);
    display: block;
    position: absolute;
    bottom: calc(-1 * var(--spacing-xs));
    left: var(--spacing-xs);
  }
`;

export const VariantOptionDivider = styled.span`
  background-color: var(--border-color-primary);
  display: block;
  align-self: stretch;

  [data-component-name='Dropdown/DropdownMenu'] & {
    height: 1px;
    margin: calc(var(--spacing-xxs) / 2) var(--spacing-xxs);
  }

  [data-component-name='Segmented/Segmented'] & {
    width: 1px;
    margin: var(--spacing-xxs) calc(var(--spacing-xxs) / 2);
  }
`;
