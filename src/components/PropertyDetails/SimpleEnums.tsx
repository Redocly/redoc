import { memo } from 'react';

import type { ReactElement } from 'react';
import type { SimpleEnumsProps } from './types.js';

import { FieldLabel, Tag, ToggleButton } from '../common/index.js';
import { styled } from '../../styled-components.js';

export function SimpleEnumsComponent({
  enums,
  type,
  toggle,
  showToggleButton,
  toggleButtonText,
  translate,
}: SimpleEnumsProps): ReactElement {
  return (
    <Row data-testid="simple-enums">
      <FieldLabel>
        {type === 'array' ? translate('openapi.items', 'Items') : ''}{' '}
        {enums.length === 1
          ? translate('openapi.value', 'Value')
          : translate('openapi.enum', 'Enum')}
      </FieldLabel>
      {enums.map((value, idx) => (
        <Tag key={value + idx}>{JSON.stringify(value)}</Tag>
      ))}
      {showToggleButton ? <ToggleButton onClick={toggle}>{toggleButtonText}</ToggleButton> : null}
    </Row>
  );
}

export const SimpleEnums = memo<SimpleEnumsProps>(SimpleEnumsComponent);

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xxs);
  margin-top: var(--spacing-xxs);
`;
