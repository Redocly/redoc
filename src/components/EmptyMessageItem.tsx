import { styled } from 'styled-components';

import type { ReactElement } from 'react';
import type { EmptyMessageNode } from '../types/content.js';

import { useSpecTranslate } from '../hooks/useTranslate.js';
import { resolveText } from '../utils/resolveText.js';

export type EmptyMessageItemProps = { node: EmptyMessageNode };

export function EmptyMessageItem({ node }: EmptyMessageItemProps): ReactElement {
  const translate = useSpecTranslate();
  return (
    <EmptyMessage>{resolveText(translate, node.labelTranslationKey, node.label)}</EmptyMessage>
  );
}

const EmptyMessage = styled.p`
  margin: 0;
  color: var(--text-color-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
`;
