import { styled, css } from 'styled-components';

export { DeprecatedBadge } from '../Schema/styled.js';

export const Annotation = styled.div`
  margin-top: calc(var(--spacing-unit, 4px) / 2);
  margin-bottom: var(--spacing-base);
  color: var(--text-color-primary);
  overflow-wrap: break-word;

  p {
    margin: 0;
  }
`;

export const PanelAnnotation = styled(Annotation)`
  margin-bottom: 0;
  color: var(--text-color-secondary);
`;

export const FieldWrapper = styled.div<{
  $showBorder: boolean;
}>`
  padding: var(--spacing-base) 0;

  ${({ $showBorder }) =>
    $showBorder
      ? css`
          border-bottom: 1px solid var(--border-color-primary);
        `
      : css`
          padding-bottom: 0;
        `}

  &:first-of-type {
    padding-top: var(--spacing-sm);
  }
`;

export const FieldNameBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  color: var(--schemas-property-name-text-color, var(--text-color-primary));
  font-size: var(--schemas-property-name-font-size, var(--font-size-base));
  font-family: var(--schemas-property-name-font-family, var(--font-family-monospaced));
  line-height: var(--line-height-base);

  svg {
    visibility: hidden;
  }

  &:hover svg {
    visibility: visible;
  }

  & > * + * {
    margin-right: var(--spacing-xxs);
  }
`;

export const FieldName = styled.span<{ $isDeprecated?: boolean }>`
  position: relative;
  color: var(--schemas-property-name-text-color, var(--text-color-primary));
  font-size: var(--schemas-property-name-font-size, var(--font-size-base));
  font-family: var(
    --schemas-property-name-font-family,
    var(--font-family-monospaced)
  );
  font-weight: var(--font-weight-bold);
  overflow-wrap: anywhere;
  ${({ $isDeprecated }) => $isDeprecated && 'text-decoration: line-through;'}
`;

export const SchemaItemWrapper = styled.div`
  border-bottom: 1px solid var(--border-color-primary);
  padding: var(--spacing-sm) 0;
`;

export const ExpandableFieldBody = styled.div<{ $contrast?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ $contrast }) =>
    $contrast &&
    css`
      border-radius: var(--panel-border-radius, var(--border-radius));
      background-color: var(--schema-nested-background-color, transparent);
    `};
`;

export const InlineCode = styled.span<{ $required?: boolean }>`
  border: 1px solid
    var(--schema-inline-border-color, var(--border-color-primary));
  border-radius: var(--border-radius);
  padding: 2px 4px;
  background-color: var(--schema-inline-background-color, transparent);
  color: var(--schema-inline-code-text-color, var(--text-color-primary));
  font-family: var(--font-family-monospaced);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-sm);
  ${({ $required }) =>
    $required &&
    css`
      &:after {
        content: '*';
        vertical-align: text-bottom;
        color: var(--schema-property-required-label-text-color, var(--color-error-base, #d32f2f));
      }
    `}
`;

export const Value = styled.div`
  display: flex;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-md, var(--line-height-base));
  color: var(--text-color-secondary);
`;

export const NonNullLabel = styled.span`
  display: inline-block;
  color: var(--text-color-secondary);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  margin-right: var(--spacing-xxs, 4px);
`;

export const SectionLabel = styled.h4`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-lg);
  color: var(--text-color-primary);
  margin: var(--spacing-sm) 0 0;
  padding: 0;
`;

export const ArgsCollapsed = styled.span<{ $size?: 'base' | 'lg' }>`
  font-size: ${({ $size = 'base' }) => `var(--font-size-${$size})`};
  line-height: ${({ $size = 'base' }) => `var(--line-height-${$size})`};
  white-space: normal;
  color: var(--text-color-description, var(--text-color-secondary));
  font-weight: var(--font-weight-bold);
  word-break: normal;
  overflow-wrap: anywhere;
  display: inline-block;
`;

export const ReturnTypeDetailsWithArrowWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-unit, 4px);
  margin-bottom: var(--spacing-base);
`;

export const MessageBadge = styled.span<{
  $type: 'success' | 'warning' | 'error';
}>`
  font-weight: var(--font-weight-regular);
  font-size: var(--schema-property-labels-font-size, var(--font-size-sm));
  line-height: var(--line-height-base);
  margin-right: var(--spacing-xxs, 4px);
  color: ${({ $type }) =>
    $type === 'error'
      ? 'var(--schema-property-required-label-text-color, var(--color-error-base, #d32f2f))'
      : `var(--color-${$type}-text)`};
`;
