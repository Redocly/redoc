import type { IMenuItem } from '../services/types';

export function isRenderableMenuItem(item: IMenuItem) {
  return (
    item.type === 'operation' ||
    item.type === 'schema' ||
    item.type === 'tool' ||
    item.type === 'rsrc' ||
    item.type === 'prompt'
  );
}
