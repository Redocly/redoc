import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { Node } from '@markdoc/markdoc';

import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';

import { SchemaDescription } from '../SchemaDescription.js';

const EnumTableWrapper = styled(MarkdownWrapper)`
  table.md {
    margin: var(--spacing-xs) 0 0;
  }
`;

type SchemaEnumDescriptionValue = string | Node | Node[];

type SchemaEnumDescriptionsProps = {
  values: Record<string, SchemaEnumDescriptionValue>;
  type?: string;
};

export function SchemaEnumDescriptions({
  values,
  type,
}: SchemaEnumDescriptionsProps): ReactElement {
  const entries = Object.entries(values);
  const prefix = type?.startsWith('Array') ? 'Items ' : '';
  const heading = `${prefix}${entries.length === 1 ? 'Value' : 'Enum Value'}`;

  return (
    <EnumTableWrapper as="div">
      <table className="md">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>{heading}</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([value, description]) => (
            <tr key={value}>
              <td>{value}</td>
              <td>
                <SchemaDescription value={description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </EnumTableWrapper>
  );
}
