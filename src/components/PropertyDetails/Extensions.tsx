import { memo } from 'react';
import { useAtomValue } from 'jotai';

import type { ReactNode } from 'react';
import type { ExtensionsProps } from './types.js';

import { Markdown as MarkdownWrapper } from '@redocly/theme/components/Markdown/Markdown';

import { ExtensionValue, FieldLabel } from '../common/index.js';
import { globalOptionsAtom } from '../../jotai/store.js';
import { styled } from '../../styled-components.js';

const Container = styled(MarkdownWrapper)`
  margin: 2px 0;
`;

function ExtensionsComponent({ extensions }: ExtensionsProps) {
  const { showExtensions } = useAtomValue(globalOptionsAtom);

  return showExtensions ? (
    <>
      {Object.keys(extensions).map((key) => (
        <Container key={key}>
          <FieldLabel>{key.substring(2)}: </FieldLabel>{' '}
          <ExtensionValue>
            {
              (typeof extensions[key] === 'string'
                ? extensions[key]
                : JSON.stringify(extensions[key])) as ReactNode
            }
          </ExtensionValue>
        </Container>
      ))}
    </>
  ) : null;
}

export const Extensions = memo<ExtensionsProps>(ExtensionsComponent);
