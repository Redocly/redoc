import type { ReactNode } from 'react';

import { styled } from '../../styled-components.js';

interface SecuritySchemeItemProps {
  label: string | ReactNode;
  value: string | ReactNode;
}
export function SecuritySchemeItem({ label, value }: SecuritySchemeItemProps) {
  if (!label || !value) {
    return null;
  }

  return (
    <Row>
      <Label>{label}</Label>
      <Value>{value}</Value>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-color-secondary);
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  flex: 1;
`;

const Value = styled.div`
  flex: 1;
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  word-break: break-word;
`;
