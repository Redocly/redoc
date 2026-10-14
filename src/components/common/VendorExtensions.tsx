import { memo } from 'react';
import { styled } from 'styled-components';

import type { ReactElement } from 'react';

import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';

export type VendorExtensionsProps = {
  extensions: Record<string, unknown>;
};

function VendorExtensionsComponent({ extensions }: VendorExtensionsProps): ReactElement | null {
  if (Object.keys(extensions).length === 0) {
    return null;
  }

  return (
    <>
      {Object.keys(extensions).map((key) => (
        <MarkdownWrapper key={key}>
          <FieldLabel>{key.substring(2)}: </FieldLabel>{' '}
          <ExtensionValue>
            {typeof extensions[key] === 'string'
              ? extensions[key]
              : JSON.stringify(extensions[key])}
          </ExtensionValue>
        </MarkdownWrapper>
      ))}
    </>
  );
}

export const VendorExtensions = memo(VendorExtensionsComponent);

const FieldLabel = styled.span`
  font-weight: var(--font-weight-semibold);
`;

const ExtensionValue = styled.span`
  font-family: var(--font-family-monospaced);
`;
