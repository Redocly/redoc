import type { ReactElement } from 'react';
import type { AdmonitionNode } from '../types/content.js';

import { Admonition } from '@redocly/theme/components/Admonition/Admonition';

import { useSpecTranslate } from '../hooks/useTranslate.js';
import { resolveText } from '../utils/resolveText.js';
import { Markdown } from './common/Markdown.js';

export type AdmonitionItemProps = {
  node: AdmonitionNode;
};

export function AdmonitionItem({ node }: AdmonitionItemProps): ReactElement {
  const translate = useSpecTranslate();
  const name = resolveText(translate, node.nameTranslationKey, node.name) || undefined;

  return (
    <Admonition type={node.admonitionType} name={name}>
      {node.content && <Markdown source={node.content} />}
    </Admonition>
  );
}
