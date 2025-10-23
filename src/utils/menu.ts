import type { IMenuItem } from '../services/types';

export function isRenderableMenuItem(item: IMenuItem) {
  return item.type === 'operation' || item.type === 'schema' || item.type === 'mcp';
}
