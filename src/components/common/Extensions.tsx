import { memo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactElement } from 'react';

import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';

import { ExtensionValue, FieldLabel } from './index.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { styled } from '../../styled-components.js';

const Extension = styled(MarkdownWrapper)`
  margin: 2px 0;
`;

export interface ExtensionsProps {
  extensions: {
    [k: string]: string | Record<string, unknown>;
  };
}

function ExtensionsComponent({ extensions }: ExtensionsProps): ReactElement | null {
  const { showExtensions } = useAtomValue(globalOptionsAtom);

  return showExtensions ? (
    <div>
      {Object.keys(extensions).map((key) => (
        <Extension key={key}>
          <FieldLabel>{key.substring(2)}: </FieldLabel>{' '}
          <ExtensionValue>
            {typeof extensions[key] === 'string'
              ? (extensions[key] as string)
              : JSON.stringify(extensions[key])}
          </ExtensionValue>
        </Extension>
      ))}
    </div>
  ) : null;
}

export const Extensions = memo<ExtensionsProps>(ExtensionsComponent);
