import type { Node } from '@markdoc/markdoc';
import type { ReactElement } from 'react';

import { Markdown } from '../common/Markdown.js';

export function renderDescription(description: unknown): ReactElement | string | null {
  if (!description) return null;
  if (typeof description === 'string') return description;
  if (Array.isArray(description) || typeof description === 'object') {
    return <Markdown source={description as Node | Node[]} />;
  }
  return String(description);
}
