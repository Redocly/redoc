import { memo } from 'react';

import type { ReactElement } from 'react';
import type { ExternalDocsNode } from '../types/content.js';

import { collectMarkdownPlainText } from '../adapters/utils/markdoc.js';
import { ExternalDocumentation } from './common/ExternalDocumentation.js';

export type ExternalDocsItemProps = {
  node: ExternalDocsNode;
};

function ExternalDocsItemComponent({ node }: ExternalDocsItemProps): ReactElement | null {
  const label = collectMarkdownPlainText(node.description);

  return (
    <ExternalDocumentation
      externalDocs={{
        url: node.url,
        description: label || undefined,
      }}
    />
  );
}

export const ExternalDocsItem = memo(ExternalDocsItemComponent);
