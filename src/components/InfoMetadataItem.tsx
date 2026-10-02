import { memo } from 'react';

import type { ReactElement } from 'react';
import type { InfoMetadataNode } from '../types/content.js';

import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';
import { H3 } from '@redocly/theme/components/Typography/H3';

import { useSpecTranslate } from '../hooks/useTranslate.js';

function InfoMetadataItemComponent({ node }: { node: InfoMetadataNode }): ReactElement | null {
  const translate = useSpecTranslate();
  const { rows } = node;
  if (rows.length === 0) {
    return null;
  }

  return (
    <MarkdownWrapper>
      <H3>{translate('info.metadata.title', 'Metadata')}</H3>
      <table className="md">
        <thead>
          <tr>
            <th scope="col">{translate('key', 'Key')}</th>
            <th scope="col">{translate('value', 'Value')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, value }) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </MarkdownWrapper>
  );
}

export const InfoMetadataItem = memo(InfoMetadataItemComponent);
