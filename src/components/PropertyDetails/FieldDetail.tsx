import { memo } from 'react';

import type { ReactElement } from 'react';

import { FieldLabel, DefaultValue, FieldValueLabel, ExpandableExample } from '../common/index.js';
import { styled } from '../../styled-components.js';

export interface FieldDetailProps {
  value?: any;
  label: string;
  raw?: boolean;
  type?: 'default' | 'example' | 'other';
}

function FieldDetailComponent({
  value,
  label,
  raw,
  type = 'other',
}: FieldDetailProps): ReactElement | null {
  if (value === undefined) {
    return null;
  }

  const _value = raw ? String(value) : JSON.stringify(value);

  return (
    <Wrapper>
      <FieldLabel> {label} </FieldLabel>
      {type === 'default' ? (
        <DefaultValue>{_value}</DefaultValue>
      ) : type === 'example' ? (
        <ExpandableExample value={_value} />
      ) : (
        <FieldValueLabel>{_value}</FieldValueLabel>
      )}
    </Wrapper>
  );
}

export const FieldDetail = memo<FieldDetailProps>(FieldDetailComponent);

const Wrapper = styled.div`
  margin-top: var(--spacing-xxs);
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xxs);
  flex-wrap: wrap;
`;
