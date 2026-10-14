import { memo } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { markdownLinksCss } from '@redocly/theme/components/Markdown/styles/links';

type ExternalDocsData = {
  url: string;
  description?: string | Record<string, unknown>;
};

type ExternalDocumentationProps = {
  externalDocs: ExternalDocsData;
  compact?: boolean;
};

// Simple utility to normalize text from either string or object with raw property
const normalizeText = (text?: string | Record<string, unknown>): string => {
  if (typeof text === 'string') {
    return text;
  }
  return (text as { raw?: string })?.raw || '';
};

function ExternalDocumentationComponent({
  externalDocs,
  compact,
}: ExternalDocumentationProps): ReactElement | null {
  if (!externalDocs || !externalDocs.url) {
    return null;
  }
  const description = normalizeText(externalDocs.description);
  return (
    <LinkWrap $compact={!!compact} data-testid="external-documentation">
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

const LinkWrap = styled.div<{ $compact?: boolean }>`
  ${markdownLinksCss as unknown as string};
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  ${({ $compact }) => (!$compact ? 'margin: var(--spacing-md) 0 0' : '')}

  a {
    font-size: inherit;
  }
`;
