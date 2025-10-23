import { memo } from 'react';

import type { ReactElement } from 'react';
import type { DescriptionEnumsProps } from './types.js';

import { Markdown } from '../Markdown/index.js';
import { DescriptionEnumsBlock } from './styled.js';
import { ToggleButton } from '../common/index.js';
import { styled } from '../../styled-components.js';

const EnumValueStyled = styled.td`
  word-wrap: break-word;
  font-size: var(--md-table-font-size);
`;

const DescriptionValueStyled = styled.td`
  & p,
  p:only-of-type {
    margin: 0;
  }
`;

export function DescriptionEnumsComponent({
  enums,
  toggle,
  showToggleButton,
  toggleButtonText,
  type,
  translate,
}: DescriptionEnumsProps): ReactElement {
  return (
    <>
      <DescriptionEnumsBlock>
        <table className="md">
          <thead>
            <tr>
              <th style={{ width: '30%' }}>
                {type === 'array' ? translate('openapi.items', 'Items') : ''}{' '}
                {enums.length === 1
                  ? translate('openapi.value', 'Value')
                  : `${translate('openapi.enum', 'Enum')} ${translate('openapi.value', 'Value')}`}
              </th>
              <th>{translate('openapi.description', 'Description')}</th>
            </tr>
          </thead>
          <tbody>
            {enums.map(({ description, value }) => {
              return (
                <tr key={value}>
                  <EnumValueStyled>{value}</EnumValueStyled>
                  <DescriptionValueStyled>
                    <Markdown source={description} />
                  </DescriptionValueStyled>
                </tr>
              );
            })}
          </tbody>
          {showToggleButton ? (
            <tfoot>
              <tr>
                <td colSpan={2}>
                  <ToggleButton onClick={toggle}>{toggleButtonText}</ToggleButton>
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </DescriptionEnumsBlock>
    </>
  );
}

export const DescriptionEnums = memo<DescriptionEnumsProps>(DescriptionEnumsComponent);
