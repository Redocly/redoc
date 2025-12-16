import { styled } from '../../styled-components.js';

type SchemaTypeInfoProps = {
  type?: string;
  className?: string;
};

export function SchemaTypeInfo({ type, className }: SchemaTypeInfoProps) {
  if (!type) return null;

  return (
    <FieldLabel className={className} data-testid="schema-type-info">
      {type}
    </FieldLabel>
  );
}

const FieldLabel = styled.em`
  vertical-align: middle;
  color: var(--schema-type-text-color);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  font-style: normal;

  :after {
    content: ',';
  }

  &:last-of-type:after {
    content: '';
  }
`;
