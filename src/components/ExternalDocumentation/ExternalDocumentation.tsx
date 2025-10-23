import { memo } from 'react';

import type { ReactElement } from 'react';
import type { OpenAPIExternalDocumentation } from '../../types/index.js';

import { markdownLinksCss } from '@redocly/theme/components/Markdown/styles/links';

import { normalizeText } from '../../utils/index.js';
import { styled } from '../../styled-components.js';

interface ExternalDocumentationProps {
  externalDocs: OpenAPIExternalDocumentation;
  compact?: boolean;
}

const LinkWrap = styled.div<{ compact?: boolean }>`
  ${markdownLinksCss as any};
  ${({ compact }) => (!compact ? 'margin: var(--spacing-sm) 0 0' : '')}
`;

function ExternalDocumentationComponent({
  externalDocs,
  compact,
}: ExternalDocumentationProps): ReactElement | null {
  if (!externalDocs || !externalDocs.url) {
    return null;
  }
  const description = normalizeText(externalDocs.description);
  return (
    <LinkWrap compact={compact} data-testid="external-documentation">
      <a
        href={externalDocs.url}
        target="_blank"
        rel="noreferrer"
        aria-label={description || externalDocs.url}
      >
        {description || externalDocs.url}
      </a>
    </LinkWrap>
  );
}

export const ExternalDocumentation = memo<ExternalDocumentationProps>(
  ExternalDocumentationComponent,
);
