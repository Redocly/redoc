import type { ReactElement } from 'react';
import type { MarkdocNode } from '../types/content.js';

import { Markdown } from './common/Markdown.js';

export type MarkdownItemProps = {
  node: MarkdocNode;
};

export function MarkdownItem({ node }: MarkdownItemProps): ReactElement {
  return <Markdown source={node.content} />;
}
