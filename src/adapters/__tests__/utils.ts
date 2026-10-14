import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ApiItem } from '../../types/store.js';
import type { ContentType, ItemVariant } from '../../types/common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FIXTURES_DIR = resolve(__dirname, '__fixtures__/specs');

export function readFixture(relativePath: string): string {
  return readFileSync(resolve(FIXTURES_DIR, relativePath), 'utf-8');
}

export function collectAllItems(items: ApiItem[]): ApiItem[] {
  return items.flatMap((item) => [
    item,
    ...('items' in item && Array.isArray(item.items)
      ? collectAllItems(item.items as ApiItem[])
      : []),
  ]);
}

export function filterByContentType(items: ApiItem[], type: ContentType): ApiItem[] {
  return items.filter((item) => item.content?.contentType === type);
}

export function filterByItemVariant(items: ApiItem[], variant: ItemVariant): ApiItem[] {
  return items.filter(
    (item) => item.content?.contentType === 'item' && item.content?.itemVariant === variant,
  );
}
